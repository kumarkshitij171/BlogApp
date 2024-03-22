import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import { UserContextprovider } from './context/UserContext'
import { PostContextprovider } from './context/PostContext'

function App() {

  return (
    <>
      <UserContextprovider >
        <PostContextprovider>
          <Header />
          <Outlet />
          {/* <Footer/> */}
        </PostContextprovider>
      </UserContextprovider>
    </>
  )
}

export default App
