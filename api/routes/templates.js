const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Get all nè chó"
    });
});

router.get('/:id', (req, res, next) => {
    res.status(200).json({
        message: "Get theo id nè chó"
    });
});

router.post('/', (req, res, next) => {
    const account = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password
    };
    if (account) {
        res.status(200).json({
            message: "Thêm rồi chó",
            account: account
        });
        console.log(account);
    } else {
        res.status(500).json({
            message: "Lỗi khi thêm rồi chó"
        })
    }
});

router.patch('/:id', (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    if (updateOps) {
        res.status(200).json({
            message: "Sửa rồi chó",
            id: req.params.id
        });
    } else {
        res.status(500).json({
            message: "Lỗi khi sửa rồi chó"
        })
    }
});

router.delete('/:id', (req, res, next) => {
    res.status(200).json({
        message: "Xóa rồi chó",
        id: req.params.id,
        temp: {
            "productTypeId": "5b98a68bfe67871b2068adcf",
            "storeId": "5b989eb9a6bce5234c9522ea",
            "productName": "Bộ vi xử lý/ CPU Pentium G5500 (3.8GHz)",
            "price": 2.400,
            "saleOffId": "5b9a041bdc6dd91b48a40e5b",
            "specifications": [
                {
                    "title": "Bảo hành (tháng)",
                    "value": "36"
                },
                {
                    "title": "Thương hiệu",
                    "value": "Intel"
                },
                {
                    "title": "Loại CPU",
                    "value": "Desktop"
                },
                {
                    "title": "Mẫu CPU",
                    "value": "Pentium"
                },
                {
                    "title": "Ngày ra mắt",
                    "value": "Q2'2018"
                },
                {
                    "title": "Dòng CPU",
                    "value": "Không"
                },
                {
                    "title": "Socket",
                    "value": "LGA1151-v2"
                },
                {
                    "title": "Nhân CPU",
                    "value": "Coffee Lake"
                },
                {
                    "title": "Số nhân",
                    "value": "2"
                },
                {
                    "title": "Số luồng",
                    "value": "4"
                },
                {
                    "title": "Xung cơ bản",
                    "value": "3.8 GHz"
                }
            ],
            "overviews": [
                {
                    "title": "Bộ vi xử lý/ CPU Pentium G5500 (3.8GHz)",
                    "value": "CPU Intel Pentium Gold G5500 3.8Ghz / 4MB / Socket 1151 là thế hệ vi xử lý mới nhất của nhà sản xuất danh tiếng intel được chạy trên nền tảng Coffee Lake mới nhất hiện nay, tối ưu hóa về giải trí, chơi game, hay xử lý đồ họa ở mức cao. sản phầm đang được bán tại Phong Vũ."
                }
            ]
        }
    });
});

module.exports = router;