import "./panel.css";
import "bootstrap/dist/css/bootstrap.min.css"
import { Link,useNavigate } from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
const Panel=() =>{
    const Navigate=useNavigate();
    const handleLogout = async() =>{
    try{
       const auth = getAuth();
        await signOut(auth);
        Navigate("/login");
    }
    catch{
        console.error("Error logging out");
    }
    }
return(
      <div className='panel'>
        <div className="header">
            <h4>My Account</h4>
        </div>
        <Link to="/profile" className="btn left-nav">
            <i class="bi bi-person-fill nav"></i>Profile
        </Link>
        <Link to="/bill" className="btn left-nav">
            <i class="bi bi-receipt nav"></i> Invoice
        </Link>
        <Link to="/customer" className="btn left-nav">
           <i class="bi bi-person-vcard-fill nav"></i>Customer
        </Link>
        <Link to="/" className="btn left-nav">
            <i className="bi bi-display nav"></i> Dashboard
        </Link>
        <Link to="/login" onClick={handleLogout} className="btn left-nav">
            <i className="bi bi-box-arrow-right nav"></i> Logout
        </Link>

      </div>
)
};

export default Panel;