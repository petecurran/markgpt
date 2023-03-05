import roboteacher from '../assets/roboteacher.png'
import { useState } from 'react'
import axios from 'axios'


const Login = (props) => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failedLogin, setFailedLogin] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        try {
            axios.post('http://127.0.0.1:5000/token', {
            username: username,
            password: password,
            })
        .then(res => {
            props.handleToken(res.data.access_token, res.data.refresh_token);
         })  
        .catch (error => {
            if (error.response.status === 401){
                setFailedLogin(true);
            }
        })
        } catch (error) {
            console.log(error)
            
        }
    }

    return(
        <div>

            {/* Mobile version & tablet version */}
            <div className="d-flex h-100 login-page-mobile d-lg-none p-2">
                <div className="container mx-auto my-auto login-card-mobile">
                    <div className="row">
                        <div className="col-12 login-picture-holder-mobile">
                            <img src={roboteacher} alt="robot teacher" className="login-picture-mobile" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 login-column-mobile">
                            <div className="login-text">
                                <h1 className="text-center brand-text-mobile">markGPT</h1>
                                {failedLogin ? <p className="text-center text-danger failed-login-text">Incorrect username or password</p> : null}
                                <form className="login-form-mobile">
                                    <div className="form-group">
                                        <input type="text" className="form-control mt-3" id="username" placeholder="Enter username" onChange={(e)=> setUsername(e.target.value)} />
                                        <input type="password" className="form-control mt-2" id="password" placeholder="Enter password" onChange={(e)=> setPassword(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-3 w-100 login-button" onClick={handleClick}>Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Desktop version */}
            <div className="d-flex h-100 login-page d-none d-lg-flex">
                <div className="container mx-auto my-auto login-card">
                    <div className="row h-100">
                        <div className="col-md-4 login-column">
                            <div className="login-text">
                                <h1 className="text-center brand-text">markGPT</h1>
                                {failedLogin ? <p className="text-center text-danger failed-login-text">Incorrect username or password</p> : null}
                                <form>
                                    <div className="form-group">
                                        <input type="text" className="form-control mt-3" id="username" placeholder="Enter username" onChange={(e)=> setUsername(e.target.value)} />
                                        <input type="password" className="form-control mt-2" id="password" placeholder="Enter password" onChange={(e)=> setPassword(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-3 w-100 login-button" onClick={handleClick}>Login</button>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-8 login-picture-holder">
                            <img src={roboteacher} alt="robot teacher" className="login-picture" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login