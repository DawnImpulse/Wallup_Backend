var email,
    username,
    login;

var email_check_query   = `select aid from unsplash_user where email=?`;
var client_id_query     = `select client_id from unsplash_user where email=?`;
var username_query      = `select aid from unsplash_user where username=?`;
var user_register       = `INSERT INTO unsplash_user (email,username,client_id) VALUES (?,?,?)`;
var signin_result;

var unsplash_client_id = `a25247a07df2c569f6f3dc129f43b0eb3b0e3ff69b00d5b84dd031255e55b961`;

w1.on(`unsplash_user`,function(req,res){

    email       = req.query.email;
    username    = req.query.username;
    login       = req.query.login;

    var email_check_result = emailCheck(email);
    // User is Siging In
    if(login == "signin")
    {
        //There is error in Email Check or Email Not Present
        if(email_check_result.success == "false")
        {
            res.json(email_check_result);

        }else // Email Present
        {
            //Get Client Id for the Email
            sql_conn.query(client_id_query , [email], function(err,result){

                if(err)
                {
                    signin_result = {success : "false" , errorMessage : "Client Id Query Error"};        
                }else
                {
                    if(result.length == 1)
                    {
                        signin_result = {success : "true" , client_id : result[0].client_id};
                    }else
                    {
                        signin_result = {success : "false" , errorMessage : "No Client Id Present"}
                    }
                }
            });

            //Wait till we get Response from Sql_query
            while(!signin_result){require('deasync').sleep(10);};
            res.json(signin_result);
        }

    }else // User is Registering
    {
        //Email is Present i.e. it fails
        if(email_check_result.success == "true")
        {
            res.json({success : "false" , errorMessage : "Email Already Present"});

        }else //Email Not Present or Eror
        {
            //Any other Error
            if(!email_check_result.errorMessage === "No Email Present")
            {
                res.json(email_check_result);

            }else // Email not Present after all
            {
                var username_check = unsplash_username(username);

                //username is present
                if(username_check.success == "true")
                {
                    res.json({success : "false" , errorMessage : "Username Already Present"});

                }else //username not present or other error
                {
                    //Any other error
                    if(!username_check.errorMessage === "No Username")
                    {
                        res.json(username_check);

                    }else // No username present after all
                    {
                        userRegister(email,username,res);
                    }                
                }
            }
        }    
    }
});

function emailCheck(email)
{
    var result1;
    sql_conn.query(email_check_query ,email,function(err,result){
        if(err)
        {
            result1 = { success : "false" , errorMessage : "Email Check Error" };
        }else
        {
            if(result.length==1) {
                result1 = { success : "true" };
            }else
            {
                result1 = { success : "false" , errorMessage : "No Email Present" };
            }
        }
    });

    while(!result1){require('deasync').sleep(10);};
    return result1;
}

function unsplash_username(username)
{
    var result1;
    sql_conn.query(username_query ,username,function(err,result){
        if(err)
        {
            result1 = { success : "false" , errorMessage : "Username Check Error" };
        }else
        {
            if(result.length==1) {
                result1 = { success : "true" };
            }else
            {
                result1 = { success : "false" , errorMessage : "No Username" };
            }
        }
    });

    while(!result1){require('deasync').sleep(10);};
    return result1;
}

function userRegister(email,username,res)
{
    var user_usplash_result;

    //Verifying username from Unsplash
    request({
        uri:`https://api.unsplash.com/users/`+username+`?client_id=`+unsplash_client_id,
        method : "GET",
    },function(error,result,body){
        if(error)
        {
            user_usplash_result = {success : "false" , errorMessage : "Request Failed"};
            console.log(error);
        }
        else
        {
            var parsed = JSON.parse(body);
            if(!parsed.hasOwnProperty(`errors`))
            {                
                user_usplash_result = {success : "true"}
            }else
            {            
                var array = parsed.errors;
                if(!array[0] === "Couldn't find User")
                {
                    user_usplash_result = {success : "false" , errorMessage : array[0]}
                }else
                {
                    user_usplash_result = {success : "false" , errorMessage : "User not Present on Unsplash"}
                }                
            }
        }
    });

    //waiting for request to finish
    while(!user_usplash_result){require('deasync').sleep(10);};

    //Error in Request or Username present
    if(user_usplash_result.success == "false")
    {
        res.json(user_usplash_result);

    }else //Username not present
    {    
        //generating UID/client_id
        var client_id_result = generateUID();

        //error in generating UID
        if(!client_id_result.success == "true")
        {            
            res.json({success : "false" , errorMessage : "Client id generate failed"});

        }else //UID success
        {
            sql_conn.query(user_register,[email,username,client_id_result.uid],function(err,result){

                if(err)
                {
                    res.json({success : "false" , errorMessage : "User Register Query Error"})
                }else
                {
                    res.json({success : "true" , client_id : client_id_result.uid});
                }
            });
        }
        
    }
}