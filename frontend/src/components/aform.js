import React, {useState} from 'react'


export default function AForm  ({ forgotScreen = true, resetScreen = false, value, onChange, value2, onChange2 ,  onSubmit, value3, onChange3})  {
  const styles = `
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600);
  /* ... (rest of your CSS) ... */

  /* Remove styles affecting the body */

  #form {
      position: relative;
      background: #fff;
      max-width: 400px;
      margin: auto;
      padding: 25px;
      border-top: 10px solid red;
      border-radius: 4px;
      box-shadow: 0 2px 1px rgba(0, 0, 0, .1);
  }

  #form * {
      font-size: 14px;
  }

  #form [type=password],
  #form [type=submit],
  #form [type=text],
  #form textarea {
      width: 100%;
      display: block;
  }

  #form legend {
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 1px;
  }

  h1 {
      margin: auto;
      text-align: center;
      font-weight: 300;
      margin-bottom: 40px;
      color: #c4825d;
  }
`;


 const Submission = (e) => {
  onSubmit(); // Call the onSubmit function passed as a prop
};



  return (
    <div id='form' className='_form'>
      <style>{styles}</style>



      {resetScreen && (

<form action='#' name='addUser' onSubmit={Submission}>



<fieldset>
  <legend>PASSWORD</legend>
  <input type='password' name='password' placeholder=' New password' 
  value={value2}
  onChange={onChange2}
  />
</fieldset>

<fieldset>
  <legend>PASSWORD</legend>
  <input type='password' name='confirm_password' placeholder=' Confirm password' 
  value={value3}
  onChange={onChange3}
  />
</fieldset>


<input type='submit' name='submit' value='SET NEW PASSWORD' />
</form>


      )   }


{forgotScreen && (

<form action='#' name='addUser' onSubmit={Submission}>



<fieldset>
  <legend>EMAIL</legend>
  <input type='email' name='email' placeholder=' Enter  Registered Enail' 
  value={value}
  onChange={onChange}
  />
</fieldset>



<input type='submit' name='submit' value='SEND PASSWORD RESET LINK' />
</form>


      )   }


    </div>
  );
};
