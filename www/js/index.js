$(function () {
var url_base = "";
function showPage(page) {
    var $current_page = $("#common_current_page");
    var current_page_id = $current_page.val();
    if (current_page_id) {
        $("#" + current_page_id).hide();
    }

    $("#" + page).show();
    $current_page.val(page);

    if (page === "page_profile") {
        init_profile();
        return false;
    }

    if (page === "page_product") {
        init_product();
        return false;
    }

    if (page === "page_history") {
        init_history();
        return false;
    }

    if (page === "page_order") {
        init_order();
        return false;
    }
 
    return false;
}

//Menu
//$('#menu_product,#menu_order,#menu_history,#menu_profile').sidr({
//    name: 'menuNav',
//    source: '#menu_list_common',
//    renaming: false
//});

function createMenu() {
    var user_token = $("#common_user_token").val();
    if (user_token) {
        $("#common_menu_register").parent().css("display", "none");
        $("#common_menu_register_web").parent().css("display", "none");

        $("#common_menu_login").parent().css("display", "none");
        $("#common_menu_login_web").parent().css("display", "none");

        $("#common_menu_history").parent().css("display", "block");
        $("#common_menu_history_web").parent().css("display", "block");
        $("#common_menu_order").parent().css("display", "block");
        //$("#common_menu_order_web").parent().css("display", "block");
        $("#common_menu_profile").parent().css("display", "block");
        $("#common_menu_profile_web").parent().css("display", "block");
        $("#common_menu_logout").parent().css("display", "block");
        $("#common_menu_logout_web").parent().css("display", "block");
    } else {
        $("#common_menu_register").parent().css("display", "block");
        $("#common_menu_register_web").parent().css("display", "block");
        $("#common_menu_login").parent().css("display", "block");
        $("#common_menu_login_web").parent().css("display", "block");

        $("#common_menu_history").parent().css("display", "none");
        $("#common_menu_history_web").parent().css("display", "none");
        $("#common_menu_order").parent().css("display", "none");
        //$("#common_menu_order_web").parent().css("display", "none");
        $("#common_menu_profile").parent().css("display", "none");
        $("#common_menu_profile_web").parent().css("display", "none");
        $("#common_menu_logout").parent().css("display", "none");
        $("#common_menu_logout_web").parent().css("display", "none");
    }

    $('#menu_product,#menu_order,#menu_history,#menu_profile').sidr({
        name: 'menuNav',
        source: '#menu_list_common',
        renaming: false
    });
}

$(document).bind("click", function () {
    $.sidr('close', 'menuNav');
});

$(document).on("click", "#common_menu_product,#common_menu_product_web", function () {
    $.sidr('close', 'menuNav');
    showPage("page_product");
    return false;
});

$(document).on("click", "#common_menu_order", function () {
    $.sidr('close', 'menuNav');
    showPage("page_order");
    return false;
});

$(document).on("click", "#common_menu_history,#common_menu_history_web", function () {
    $.sidr('close', 'menuNav');
    showPage("page_history");
    return false;
});

$(document).on("click", "#common_menu_profile,#common_menu_profile_web", function () {
    $.sidr('close', 'menuNav');
    showPage("page_profile");
    return false;
});

$(document).on("click", "#common_menu_register,#common_menu_register_web", function () {
    $.sidr('close', 'menuNav');
    showPage("page_register");
    return false;
});

$(document).on("click", "#common_menu_login,#common_menu_login_web", function () {
    $.sidr('close', 'menuNav');
    showPage("page_login");
    return false;
});

$(document).on("click", "#common_menu_logout,#common_menu_logout_web", function () {
    $.sidr('close', 'menuNav');
    localStorage.removeItem('users');

    $("#common_user_token").val("");
    $("#common_menu_title").html("<i class=''icon-double-angle-right icon-2x'></i>");

    createMenu();
    showPage("page_login");
    return false;
});   function init_product() {

    var data_init = $("#page_product").attr("data-init");
    if (data_init === "1")
        return false;

    $.ajax({
        type: "get",
        url: url_base + "/Product/GetProductList",
        success: function (data) {
            if (data.OK) {
                $("#list_product").html(data.Message);
                $("#title_product").html(data.Title);
                $("#store_name").html(data.Title);
                $("#page_product").attr("data-init", "1");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
}

$(document).on("click", "[data-product]", function () {
    var $this = $(this);

    var pk = $this.attr("data-product");
    var url = $this.attr("data-url");

    $.ajax({
        type: "get",
        dataType: "json",
        url: url_base + url,
        data: { pk: pk },
        success: function (data) {
            if (data.OK) {
                $("#detail_product").html(data.Message);
                showPage("page_product_detail");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#back_product_detail", function () {
    showPage("page_product");
    return false;
});

$(document).on("click", "[data-item]", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token) {
        showPage("page_user");
        return false;
    }

    var $this = $(this);
    var pk = $this.attr("data-item");
    var url = $this.attr("data-url");

    $.ajax({
        type: "get",
        dataType: "json",
        url: url_base + url,
        data: { pk: pk },
        success: function (data) {
            if (data.OK) {
                $("#form_product_addtocart").html(data.Message);
                showPage("page_product_addtocart");

            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#save_product_addtocart", function () {

    $.ajax({
        type: "post",
        url: url_base + "/Product/AddToCart",
        data: $('#form_product_addtocart').serialize(),
        success: function (data) {
            if (data.OK) {
                $("[data-cart]").html(data.Message);
                $("#page_order").attr("data-init", "1");
                showPage("page_order");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_product_addtocart", function () {
    showPage("page_product");
    return false;
});
function init_order() {

    var data_init = $("#page_order").attr("data-init");
    if (data_init === "1")
        return false;

    $.ajax({
        type: "get",
        url: url_base + "/Order/GetOrderCart",
        success: function (data) {
            if (data.OK) {
                $("#list_order").html(data.Message);
                $("#page_order").attr("data-init", "1");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
}

$(document).on("click", "#cancel_order", function () {
    showPage("page_product");
    return false;
});

$(document).on("click", "[data-remove]", function () {
    var $this = $(this);

    var data_pk = $this.attr("data-remove");
    var url = $this.attr("data-url");

    $.ajax({
        type: "get",
        dataType: "json",
        url: url_base + url,
        data: { pk: data_pk },
        success: function (data) {
            if (data.OK) {
                $("[data-cart]").html(data.Message);
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });
});

$(document).on("click", "[data-checkout]", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token)
        return false;

    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    $.ajax({
        type: "get",
        url: url_base + "/Order/Checkout",
        data: { UserToken: user_token },
        success: function (data) {
            if (data.OK) {
                $("#form_order_checkout").html(data.Message);
                showPage("page_order_checkout");
            } else {
                alert(data.Message);
            }

            $this.removeAttr("disabled").html(dispaly);
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#save_order_checkout", function () {
    var user_token = $("#common_user_token").val();
    if (!user_token)
        return false;

    $("#form_order_checkout [data-token]").val(user_token);

    var $this = $(this);
    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    $.ajax({
        type: "post",
        url: url_base + "/Order/Checkout",
        data: $('#form_order_checkout').serialize(),
        success: function (msg) {
            if (msg.OK) {
                alert("Your order has been completed.");
                $("[data-cart]").html(msg.Message);
                $("#page_order").attr("data-init", "");
                showPage("page_product");
            } else {
                alert(msg.Message);
            }

            $this.removeAttr("disabled").html(dispaly);
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_order_checkout", function () {
    showPage("page_product");
    return false;
});

$(document).on("click", "#minusQuantity", function () {

    var $Quantity = $("#Quantity");
    var quantity = parseInt($Quantity.val(), 10);
    if (quantity <= 1)
        return;

    quantity = quantity - 1;
    $Quantity.val(quantity);
    $("#readonlyQuantity").val(quantity);
});

$(document).on("click", "#plusQuantity", function () {

    var $Quantity = $("#Quantity");
    var quantity = parseInt($Quantity.val(), 10);

    quantity = quantity + 1;
    $Quantity.val(quantity);
    $("#readonlyQuantity").val(quantity);
});

$(document).on("click", "#checkout_delivery,#checkout_carryout", function () {

    var value = $(this).val();
    if (value === "1") {
        $("#checkout_address1").show();
        $("#checkout_address2").show();
    } else {
        $("#checkout_address1").hide();
        $("#checkout_address2").hide();
    }
});function init_history() {

    var data_init = $("#page_history").attr("data-init");
    if (data_init === "1")
        return false;

    var user_token = $("#common_user_token").val();
    if (!user_token)
        return false;

    $.ajax({
        type: "get",
        url: url_base + "/History/GetHistoryList",
        data: { UserToken: user_token },
        success: function (data) {
            if (data.OK) {
                $("#list_history").html(data.Message);
                $("#page_history").attr("data-init", "1");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
}

$(document).on("click", "#refresh_history", function () {
    var $this = $(this);

    var user_token = $("#common_user_token").val();
    if (!user_token)
        return false;

    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    $.ajax({
        type: "get",
        url: url_base + "/History/GetHistoryList",
        data: { UserToken: user_token },
        success: function (data) {
            if (data.OK) {
                $("#list_history").html(data.Message);
                $("#page_history").attr("data-init", "1");
            } else {
                alert(data.Message);
            }

            $this.removeAttr("disabled").html(dispaly);
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_history", function () {
    showPage("page_product");
    return false;
});

$(document).on("click", "[history-item]", function () {
    var $this = $(this);
    var data_pk = $this.attr("history-item");
    var url = $this.attr("data-url");

    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    $.ajax({
        type: "get",
        dataType: "json",
        url: url_base + url,
        data: { pk: data_pk },
        success: function (data) {
            if (data.OK) {
                $("#detail_history").html(data.Message);
                showPage("page_history_detail");
            } else {
                alert(data.Message);
            }

            $this.removeAttr("disabled").html(dispaly);
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

});

$(document).on("click", "#reorder_history_detail", function () {
    var $this = $(this);
    var data_pk = $this.attr("data-pk");

    var dispaly = $this.html();
    $this.attr("disabled", "disabled").html('<i class="icon-spinner icon-spin icon-2x"></i>');

    $.ajax({
        type: "post",
        dataType: "json",
        url: url_base + "/History/ReOrder",
        data: { pk: data_pk },
        success: function (data) {
            if (data.OK) {
                $("[data-cart]").html(data.Message);
                $("#page_order").attr("data-init", "1");
                showPage("page_order");
            } else {
                alert(data.Message);
            }

            $this.removeAttr("disabled").html(dispaly);
        },
        error: function (x) {
            $this.removeAttr("disabled").html(dispaly);
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_history_detail,#back_history_detail", function () {
    showPage("page_history");
    return false;
});function init_profile() {

    var data_init = $("#page_profile").attr("data-init");
    if (data_init === "1")
        return false;

    var user_token = $("#common_user_token").val();
    if (!user_token)
        return false;

    $.ajax({
        type: "get",
        url: url_base + "/Account/Profile",
        data: { UserToken: user_token },
        success: function (data) {
            if (data.OK) {
                $("#form_profile").html(data.Message);
                $("#page_profile").attr("data-init", "1");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
}

$(document).on("click", "#save_profile", function () {

    var email = $("#profile_Email").val();
    if (email.length <= 0) {
        alert("The email can not be empty.");
        return false;
    }

    var password = $("#profile_password").val();
    var confirmPassword = $("#profile_confirm_password").val();
    if (password.length < 6) {
        alert("The password must be at least 6 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("The password and confirmation password do not match.");
        return false;
    }

    var phone = $("#profile_Phone").val();
    if (phone.length <= 0) {
        alert("The phome can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        url: url_base + "/Account/Profile",
        data: $('#form_profile').serialize(),
        success: function (data) {
            if (data.OK) {
                alert("Your profile has been modified.");
                $("#page_profile").attr("data-init", "");
                showPage("page_product");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_profile", function () {
    showPage("page_product");
    return false;
});

$(document).on("click", "#save_register", function () {

    var email = $("#register_email").val();
    if (email.length <= 0) {
        alert("The email can not be empty.");
        return false;
    }

    var password = $("#register_password").val();
    var confirmPassword = $("#register_confirm_password").val();
    if (password.length < 6) {
        alert("The password must be at least 6 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("The password and confirmation password do not match.");
        return false;
    }

    var phone = $("#register_phone").val();
    if (phone.length <= 0) {
        alert("The phome can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        url: url_base + "/Account/Register",
        data: $('#form_register').serialize(),
        success: function (data) {
            if (data.OK) {
                alert("Your registration has been completed, please login.");
                showPage("page_user");
            } else {
                alert(data.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_register", function () {
    showPage("page_product");
    return false;
});//Login
$(document).on("click", "#signin_login", function () {
        
    if (!$('#form_login').valid())
        return false;

    var userId = $("#login_userId").val();
    if (userId.length <= 0) {
        alert("The user id can not be empty.");
        return false;
    }

    var password = $("#login_password").val();
    if (password.length <= 0) {
        alert("The password can not be empty.");
        return false;
    }

    $.ajax({
        type: "post",
        url: url_base + "/Home/Login",
        data: $('#form_login').serialize(),
        success: function (msg) {
            if (msg.OK) {
                $("#common_user_token").val(msg.UserToken);
                $("#common_menu_profile_web").html("<i class='icon-user'></i>" + msg.UserName);
                $("#common_menu_title").html("<i class='icon-double-angle-right icon-2x'></i><span style='float:right;'>" + msg.UserName + "</span>");

                if (msg.Remeberme) {
                    localStorage.setItem('users', msg.UserToken);
                }

                createMenu();
                showPage("page_product");
            } else {
                alert(msg.Message);
            }
        },
        error: function (x) {
            alert("Failed:" + x.responseText);
        }
    });

    return false;
});

$(document).on("click", "#cancel_login", function () {
    showPage("page_product");
    return false;
});


function autoLogin() {
    $("#form_login").validate();

    var user_token = localStorage.getItem('users');
    if (!user_token) {
        createMenu();
        showPage("page_product");
        return;
    }

    $.ajax({
            type: "post",
            url: url_base + "/Home/Login",
            data: { UserToken: user_token },
            success: function (msg) {
                if (msg.OK) {
                    $("#common_user_token").val(msg.UserToken);
                    $("#common_menu_profile_web").html("<i class='icon-user'></i>" + msg.UserName);
                    $("#common_menu_title").html("<i class='icon-double-angle-right icon-2x'></i><span style='float:right;'>" + msg.UserName+"</span>");
                }

                createMenu();
                showPage("page_product"); 
            },
            error: function () {
                showPage("page_product");
            }
        });  
}

window.autoRemotingLogin = function (remote_url_base) {
    url_base = remote_url_base;
    autoLogin();
}

autoLogin();});