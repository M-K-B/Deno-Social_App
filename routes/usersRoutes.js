import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import supabase from "../db.js"


const userRouter = new Router();

userRouter.post('/login', login);


userRouter.post('/register', register);

//userRouter.post('/register')


userRouter.get('/logout', logout);



userRouter.get('/followers/:id', getFollowerAndFollowingCounts);

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
          const { dataSession, error } = await supabase.auth.getSession()

          console.log(data.session)
          context.response.body = { user: data.user , session : data.session};
          
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



        const { email, password, username, fullname } = await body;

        const { data: username_response, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', username);


        if (error) {
          console.error("Error checking username:", error);
        } else if (username_response.length > 0) {
          console.log("Username exists:", username_response);
        } else {
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
            await supabase.from('User').insert([{ user_id: CreatedID , username : username, name : fullname},]).select()
            
            context.response.body = { message: 'Registration successful', user: data.user.id };
          }
        }
        
        // Do something with email and password
        
        
    } else {
      context.response.status = 400;
      context.response.body = { message: "Request body is missing" };
    }

  
    
  } catch (err) {
    console.log(err);
    context.response.body = { message: 'An unexpected error occurred', error: err };
  }
    
}

async function logout(context){
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Logout failed'); // Handle error if logout fails
    }
    context.response.status = 200
    context.response.body = { message: 'Logged out successfully' };
  } catch (err) {
    console.error('Logout error:', err);
    context.response.status = 500;
    context.response.body = { message: 'Failed to log out', error: err.message };
  }
}


async function getFollowerAndFollowingCounts(context) {
  const id = context.params.id;
  console.log('User ID:', id);
  
  try {
    // Fetch follower count
    const { count: followerCount, error: followerError } = await supabase
      .from('follow')
      .select('*', { count: 'exact' })
      .eq('following_id', id);
    
    if (followerError) {
      console.error('Error fetching follower count:', followerError);
      context.response.status = 500;
      context.response.body = { error: 'Failed to fetch follower count' };
      return;
    }

    console.log('Follower Count:', followerCount);

    // Fetch following count
    const { count: followingCount, error: followingError } = await supabase
      .from('follow')
      .select('*', { count: 'exact' })
      .eq('follower_id', id);
    
    if (followingError) {
      console.error('Error fetching following count:', followingError);
      context.response.status = 500;
      context.response.body = { error: 'Failed to fetch following count' };
      return;
    }

    console.log('Following Count:', followingCount);

    // Send combined response
    context.response.body = { followerCount, followingCount };
  } catch (error) {
    console.error('Error:', error);
    context.response.status = 500;
    context.response.body = { error: 'Failed to fetch counts' };
  }
}
export default userRouter;
