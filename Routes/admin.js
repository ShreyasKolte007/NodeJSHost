const express = require('express');
const route = express.Router();
const jwt =  require('jsonwebtoken');
var KEY = "qwertyui";
const exe = require("./../connection");

route.get("/",function(req,res){
    const token = req.cookies.token;
    if(token){
        res.render("admin/index.ejs");
    }else{
        res.redirect("/admin/login");
    }
    
});

route.get("/login",function(req,res){
    res.render("admin/login.ejs");
})

route.post("/admin_login",async function(req,res){
    var d = req.body;
    var sql = `SELECT * FROM admin_table WHERE admin_email = '${d.user_email}' AND password = '${d.password}'`;
    var data = await exe(sql);
    if(data.length > 0){
        var token = jwt.sign({user_email:d.user_email},KEY);
        res.cookie("token",token);
        res.redirect("/admin")
    }else{
        res.redirect("/admin/login")
    }
})



route.get("/about_company",async function(req,res){
    var data = await exe(`SELECT * FROM company_details`);
    var obj = {"about_company":data};
    const token = req.cookies.token;
    if(token){
        res.render("admin/about_company.ejs",obj);
    }else{
        res.redirect("/admin/login");
    }
})

route.post("/about_company",async function(req,res){
    var d = req.body;
    
    var sql = `UPDATE company_details SET
    company_name='${d.company_name}',
    company_mobile='${d.company_mobile}',
    company_email='${d.company_email}',
    address ='${d.address}',
    whatsapp ='${d.whatsapp}',
    linkedin ='${d.linkedin}',
    facebook ='${d.facebook}',
    youtube ='${d.youtube}'`;

    var data = await exe(sql);
    res.redirect("/admin/about_company");
})

route.get("/slider",async function(req,res){
    var slider = await exe(`SELECT * FROM slider`);
    var obj = {"slider":slider}
    const token = req.cookies.token;
    res.render("admin/slider.ejs",obj)
})

route.post("/slider",async function(req,res){
    // part 1
    var FileName = Date.now()+req.files.slider_image.name;
    req.files.slider_image.mv("public/"+FileName);

    // part 2
    var d = req.body;
    var sql = `INSERT INTO slider(slider_title,slider_details,button_link,button_text,slider_image) VALUES(
        '${d.slider_title}',
        '${d.slider_details}',
        '${d.button_link}',
        '${d.button_text}',
        '${FileName}'
    )`;
    var data = await exe(sql);
    res.redirect("/admin/slider");
})   

route.get("/delete_slider/:id",async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM slider WHERE id=${id}`;
    var data = await exe(sql);
    const token = req.cookies.token;
    res.redirect("/admin/slider");
});

route.get("/edit_slider/:id",async function(req,res){
    var id = req.params.id;
    var sql = `SELECT * FROM slider WHERE id='${id}'`;
    var data = await exe(sql);
    var obj = {"slider_info":data}
    const token = req.cookies.token;
    res.render("admin/edit_slider.ejs",obj);
});

route.post("/update_slider",async function(req,res){
    var d = req.body;
    // part 1
    if(req.files){
        var FileName = Date.now()+req.files.slider_image.name;
        req.files.slider_image.mv("public/"+FileName);
        var sql = `UPDATE slider SET slider_image = '${FileName}' WHERE id='${d.id}'`;
        var data = await exe(sql);
    }

    var sql = `UPDATE slider SET
    slider_title='${d.slider_title}',
    slider_details='${d.slider_details}',
    button_link='${d.button_link}',
    button_text='${d.button_text}'
    WHERE id='${d.id}'`;

    var data = await exe(sql);
    res.redirect("/admin/slider");
});

route.get("/category",async function(req,res){
    var data = await exe(`SELECT * FROM category`);
    var obj = {"category":data};
    const token = req.cookies.token;
    res.render("admin/category.ejs",obj)
});

route.post("/category",async function(req,res){
    var data = await exe(`INSERT INTO category (category_name) VALUES ('${req.body.category_name}')`);
    res.redirect("/admin/category");
});

route.get("/delete_category/:id",async function(req,res){
    var id = req.params.id;
    const token = req.cookies.token;
    var data = await exe(`DELETE FROM category WHERE id='${id}'`);
    res.redirect("/admin/category");
});

route.get("/edit_category/:id",async function(req,res){
    var id = req.params.id;
    var sql = `SELECT * FROM category WHERE id='${id}'`;
    var data = await exe(sql);
    var obj = {"category_info":data}
    const token = req.cookies.token;
    res.render("admin/edit_category.ejs",obj);
});

route.post("/update_category",async function(req,res){
    var d = req.body;
   
    var sql = `UPDATE category SET
    category_name='${d.category_name}'
    WHERE id='${d.id}'`;

    var data = await exe(sql);
    res.redirect("/admin/category");
});

route.get("/add_product",async function(req,res){
    var category = await exe(`SELECT * FROM category`);
    var obj = {"category":category};
    const token = req.cookies.token;
    res.render("admin/add_product.ejs",obj);
});

route.post("/save_product",async function(req,res){
    // part 1 - Handle file uploads
    var product_image1 = '';
    var product_image2 = '';
    var product_image3 = '';
    var product_image4 = '';

    if(req.files && req.files.image1){
        product_image1 = Date.now()+req.files.image1.name;
        req.files.image1.mv("public/upload/"+product_image1);  
    }
    if(req.files && req.files.image2){
        product_image2 = Date.now()+req.files.image2.name;
        req.files.image2.mv("public/upload/"+product_image2);  
    }
    if(req.files && req.files.image3){
        product_image3 = Date.now()+req.files.image3.name;
        req.files.image3.mv("public/upload/"+product_image3);  
    }
    if(req.files && req.files.image4){
        product_image4 = Date.now()+req.files.image4.name;
        req.files.image4.mv("public/upload/"+product_image4);  
    }

    var d = req.body;
    
    // Insert product without product_id (let it auto-increment)
    var sql = `INSERT INTO product(
        category_id,
        product_name,
        product_company,
        product_color,
        product_label,
        product_details,
        product_image1,
        product_image2,
        product_image3,
        product_image4) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    var data = await exe(sql,[
        d.product_category,
        d.product_name,
        d.product_company,
        d.color,
        d.product_label,
        d.product_details,
        product_image1,
        product_image2,
        product_image3,
        product_image4
    ]);
    
    var product_id = data.insertId;
    
    // Insert pricing data
    if(d.product_size && Array.isArray(d.product_size)){
        for(var i=0;i<d.product_size.length;i++){
            if(d.product_price[i] && d.product_price[i].trim() !== ''){
                var sql1 = `INSERT INTO product_pricing (product_id, product_size, product_price, product_duplicate_price) VALUES (?,?,?,?)`;
                await exe(sql1, [product_id, d.product_size[i], d.product_price[i], d.product_duplicate_price[i] || 0]);
            }
        }
    }
    
    res.redirect("/admin/product_list");
})

route.get("/product_list",async function(req,res){
    
    var sql = `SELECT *,
    (SELECT MIN(product_price) FROM product_pricing
    WHERE product.product_id = product_pricing.product_id)
    AS price ,

    (SELECT MAX(product_duplicate_price) FROM product_pricing
    WHERE product.product_id = product_pricing.product_id)
    AS product_duplicate_price FROM product`;
    var data = await exe(sql);
    console.log("Product data:", data); // Debug line
    var obj = {"product_info":data};
    const token = req.cookies.token;
    res.render("admin/product_list.ejs",obj)
})

route.get("/delete_product/:id",async function(req,res){
    var id = req.params.id;
    var data = await exe(`DELETE FROM product WHERE product_id='${id}'`);
    const token = req.cookies.token;
    res.redirect("/admin/product_list");
});

route.get("/view_product/:id",async function(req,res){
    var id = req.params.id;
    var sql = `SELECT * FROM product WHERE product_id ='${id}'`;
    var sql1 = `SELECT * FROM product_pricing WHERE product_id ='${id}'`;
    var product = await exe(sql);
    var product_price = await exe(sql1);
    var obj = {"product_info":product,"product_price":product_price};
    const token = req.cookies.token;
    res.render("admin/product_info.ejs",obj);
})

route.get("/orders_list/:status",async function(req,res){
    var status = req.params.status;
    var sql = `SELECT * FROM order_table WHERE order_status='${status}'`;
    var data = await exe(sql);
    var obj = {"status":status,"orders":data};
    console.log(data)
    res.render("admin/orders_list.ejs",obj);
    const token = req.cookies.token;
})

route.get("/order_info/:order_id",async function(req,res){
    var sql = `SELECT * FROM order_table WHERE order_id = '${req.params.order_id}'`;
    var order_data = await exe(sql);
    var sql1 = `SELECT * FROM order_detail WHERE order_id = '${req.params.order_id}'`;
    var order_detail = await exe(sql1);
    var obj = {"order_data":order_data,"order_detail":order_detail};
    res.render("admin/order_info.ejs",obj);
    const token = req.cookies.token;
})

route.get("/transfer_order/:order_id/:status",async function(req,res){
    var status = req.params.status;
    var order_id = req.params.order_id;
    var today = new Date().toISOString().slice(0, 10);
    if(status == 'cancelled')
        var sql = `UPDATE order_table SET order_status='${status}',cancelled_date = '${today}' WHERE order_id='${order_id}'`
    else if(status == 'rejected')
        var sql = `UPDATE order_table SET order_status='${status}',rejected_date = '${today}' WHERE order_id='${order_id}'`
    else if(status == 'returned')
        var sql = `UPDATE order_table SET order_status='${status}',returned_date = '${today}' WHERE order_id='${order_id}'`
    else if(status == 'delivered')
        var sql = `UPDATE order_table SET order_status='${status}',delivered_date = '${today}' WHERE order_id='${order_id}'`
    else if(status == 'dispatched')
        var sql = `UPDATE order_table SET order_status='${status}',dispatched_date = '${today}' WHERE order_id='${order_id}'`
        const token = req.cookies.token;
        var data = await exe(sql);
        res.redirect("/admin/orders_list/"+status);
})
module.exports = route;
