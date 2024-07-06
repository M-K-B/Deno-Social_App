import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts"
import supabase from "../db.js"


const userRouter = new Router();

userRouter.get('/login', login);


userRouter.post('/register', reg);

//userRouter.post('/register')





userRouter.get("/", (context) => {
  context.response.body = "Hello, Oak!";
  console.log('Hello');
});

async function login(ctx) {

  const { data: users, error } = await supabase
  .from('User')
  .select('username');


  if (error) {
    console.error('Error fetching data:', error);
  } else {
    // Map the data to get usernames
    const usernames = users.map(user => user.username);
    // Log or use the mapped usernames
    console.log(usernames);
  }

  ctx.response.body = { message: users};
  console.log('GET / Login')



}


function reg(ctx) {

 let data =  console.log(ctx.request.url)
  console.log(data)
  const email = data

  const password = ctx.params.password

  console.log(`You signed up with ${email} & ${password}`)


 
}





export default userRouter;
