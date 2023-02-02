const Login = (props) => {

    return(
        <div className="container align-middle">

            <div className="row">
                <div className="col-md-3">
                    <h1>Login</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter username" />
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Enter password" />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>

                <div className="col-md-3">
                    <h1>Big juicy picture!</h1>


                </div>
            </div>
        </div>
    )
}

export default Login