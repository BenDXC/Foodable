import React, {useEffect} from 'react';

function Logout(props){
  const setLoggedinUser = props.setLoggedinUser;

  useEffect(()=>{
    setLoggedinUser("");
    sessionStorage.removeItem("jwt");
  },[setLoggedinUser]);


    return(
            <div>
                <p>Logged out</p>
            </div>
        );

}

export default Logout;