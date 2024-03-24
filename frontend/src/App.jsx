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
          <div className="relative min-h-[80vh]">
          <Header />
          <Outlet/>
          </div>
          {/* <Footer/> */}
        </PostContextprovider>
      </UserContextprovider>
    </>
  )
}

export default App
