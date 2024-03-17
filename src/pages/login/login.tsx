import { AuthPage } from '@refinedev/antd'

const Login = () => {
  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={false}
      title={<h3>Dashboard Admin</h3>}
      formProps={{
        initialValues: {
          email: 'michael.scott@dundermifflin.com',
          password: 'demodemo',
        },
      }}
    />
  )
}

export default Login
