import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import supabase from "../db.js"


const userRouter = new Router();

userRouter.post('/login', login);


userRouter.post('/register', register);

//userRouter.post('/register')





userRouter.get("/", (context) => {
  context.response.body = "Hello, Oak!";
  console.log('Hello');
});

async function login(context) {
  try {
    if (context.request.hasBody) {
      const body = await context.request.body.json();
      console.log(body)
        const { email, password } = await body;
        
        // Do something with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
      
        if (error) {
          console.log(error);
        
          let error_name = await error.name
          context.response.body = { message: 'Login failed', error};
        } else {
          
          context.response.body = { message: 'Login successful', user: data.user };
        }
        
    } else {
      context.response.status = 400;
      context.response.body = { message: "Request body is missing" };
    }

  
    
  } catch (err) {
    console.log(err);
    context.response.body = { message: 'An unexpected error occurred', error: err };
  }
    
}

async function register(context) {
  try {
    if (context.request.hasBody) {
      const body = await context.request.body.json();
      console.log(body) 
        const { email, password } = await body;
        
        // Do something with email and password
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
      
        if (error) {
          console.log(error.code);
          let error_name = await error.code
          context.response.body = { message: 'Registration failed', error_name };
        } else {
          let CreatedID = data.user.id;
          await supabase.from('User').insert([{ user_id: CreatedID },]).select()
          
          context.response.body = { message: 'Registration successful', user: data.user.id };
        }
        
    } else {
      context.response.status = 400;
      context.response.body = { message: "Request body is missing" };
    }

  
    
  } catch (err) {
    console.log(err);
    context.response.body = { message: 'An unexpected error occurred', error: err };
  }
    
}





export default userRouter;
