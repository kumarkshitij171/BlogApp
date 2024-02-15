import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { UserContextprovider } from './context/UserContext'

function App() {

  return (
    <>
    <UserContextprovider >
      <Header />
      <Outlet />
      {/* <Footer/> */}
    </UserContextprovider>
    </>
  )
}

export default App
