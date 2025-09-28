import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { Order } from '../types';

const router = express.Router();

// VNPay configuration
const VNPAY_CONFIG = {
  vnp_TmnCode: 'YOUR_TMN_CODE',
  vnp_HashSecret: 'YOUR_HASH_SECRET',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:3000/payment/callback'
};

// MoMo configuration
const MOMO_CONFIG = {
  partnerCode: 'YOUR_PARTNER_CODE',
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create'
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  VNPAY: 'vnpay',
  MOMO: 'momo',
  ZALOPAY: 'zalopay'
};

// Create VNPay payment URL
router.post('/vnpay/create', (req, res) => {
  const { amount, orderId, orderInfo } = req.body;
  
  const vnp_Params: any = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = VNPAY_CONFIG.vnp_TmnCode;
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay expects amount in cents
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_ReturnUrl'] = VNPAY_CONFIG.vnp_ReturnUrl;
  vnp_Params['vnp_IpAddr'] = req.ip;
  vnp_Params['vnp_CreateDate'] = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];

  // Sort parameters
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {} as any);

  // Create secure hash
  const querystring = Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');
  
  const signData = querystring;
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
  hmac.update(signData);
  const vnp_SecureHash = hmac.digest('hex');
  
  sortedParams['vnp_SecureHash'] = vnp_SecureHash;
  
  const paymentUrl = VNPAY_CONFIG.vnp_Url + '?' + Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  res.json({ paymentUrl });
});

// Create MoMo payment
router.post('/momo/create', async (req, res) => {
  const { amount, orderId, orderInfo } = req.body;
  
  const requestId = Date.now().toString();
  const orderId_momo = orderId;
  const orderInfo_momo = orderInfo;
  const amount_momo = amount;
  const ipnUrl = 'http://localhost:3000/payment/momo/callback';
  const redirectUrl = 'http://localhost:3000/payment/callback';
  const extraData = '';

  // Create signature
  const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount_momo}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId_momo}&orderInfo=${orderInfo_momo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
  
  const signature = crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: MOMO_CONFIG.partnerCode,
    accessKey: MOMO_CONFIG.accessKey,
    requestId: requestId,
    amount: amount_momo,
    orderId: orderId_momo,
    orderInfo: orderInfo_momo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: 'captureWallet',
    signature: signature
  };

  try {
    const response = await axios.post(MOMO_CONFIG.endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({
      paymentUrl: response.data.payUrl,
      qrCodeUrl: response.data.qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo thanh toán MoMo' });
  }
});

// VNPay callback
router.get('/vnpay/callback', (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Verify signature
  const signData = Object.keys(vnp_Params)
    .sort()
    .map(key => `${key}=${vnp_Params[key]}`)
    .join('&');
  
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret);
  hmac.update(signData);
  const checkSum = hmac.digest('hex');

  if (secureHash === checkSum) {
    const orderId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];
    
    if (responseCode === '00') {
      // Payment successful
      res.redirect(`/orders?status=success&orderId=${orderId}`);
    } else {
      // Payment failed
      res.redirect(`/orders?status=failed&orderId=${orderId}`);
    }
  } else {
    res.redirect('/orders?status=invalid');
  }
});

// MoMo callback
router.post('/momo/callback', (req, res) => {
  const { resultCode, orderId, amount } = req.body;
  
  if (resultCode === 0) {
    // Payment successful
    res.redirect(`/orders?status=success&orderId=${orderId}`);
  } else {
    // Payment failed
    res.redirect(`/orders?status=failed&orderId=${orderId}`);
  }
});

// Get payment methods
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: PAYMENT_METHODS.CASH,
        name: 'Thanh toán khi nhận hàng',
        icon: 'fas fa-money-bill-wave',
        description: 'Thanh toán bằng tiền mặt khi nhận hàng'
      },
      {
        id: PAYMENT_METHODS.VNPAY,
        name: 'VNPay',
        icon: 'fas fa-credit-card',
        description: 'Thanh toán qua VNPay'
      },
      {
        id: PAYMENT_METHODS.MOMO,
        name: 'MoMo',
        icon: 'fas fa-mobile-alt',
        description: 'Thanh toán qua ví MoMo'
      }
    ]
  });
});

export { router as paymentRoutes };
