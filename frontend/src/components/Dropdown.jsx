import { useState, useEffect, useRef, useContext } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Avatar from './Avatar';
import { UserContext } from '../context/UserContext';
import EditBtn from './EditBtn';
import { EditValidation } from '../validations/edit.validation';
import Alert from './Alert';


function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);

  const { userInfo, setUserInfo } = useContext(UserContext)
  const [editProfile, setEditProfile] = useState(false)

  const [name, setName] = useState(userInfo?.name)
  const [email, setEmail] = useState(userInfo?.email)
  const [password, setPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [UpdateProfileImg, setUpdateProfileImg] = useState(null)

  const [isEditDone, setIsEditDone] = useState(false)
  const [editMessage, setEditMessage] = useState('')
  const [editType, setEditType] = useState('')

  async function HandleLogout() {
    await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    })

    setUserInfo(null)
    setLoggedIn(false)
  }

  const viewProfile = () => {
    // get data of profile from the context
    setOpenModal(true)
  }

  const changeImg = (img) => {
    // console.log('change image',img);
    setUpdateProfileImg(img)
  }

  const profileUpdater = async (res) => {
    const data = await res.json()
    if (res.status === 200) {
      setUserInfo(data.user)
      setIsEditDone(true)
      setEditType('success')
      setEditMessage(data.message)
      setTimeout(() => {
        setIsEditDone(false)
      }, 2000);
    }
    else {
      setIsEditDone(true)
      setEditType('error')
      setEditMessage(data.error)
      setTimeout(() => {
        setIsEditDone(false)
      }, 2000);
    }
    setPassword(null)
    setNewPassword(null)
    setEditProfile(false)
  }

  const handleEditProfile = async () => {
    if (!editProfile) {
      setEditProfile(true)
    }
    else {
      const isvalid = await EditValidation.isValid({ name, email })
      if (!isvalid) {
        setName(userInfo?.name)
        setEmail(userInfo?.email);
        setEditProfile(false)
        return
      }
      // send data to backend
      let body = { name, email };
      if (password && newPassword) {
        // Add password and newPassword to the body
        body = { ...body, password, newPassword }
      }
      if (UpdateProfileImg) {
        // Add profile image to the body
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (password && newPassword) {
          formData.append('password', password);
          formData.append('newPassword', newPassword);
        }
        formData.append('profileImg', UpdateProfileImg);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/edit-profile`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        })

        profileUpdater(res);
      }
      else {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/edit-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          credentials: 'include',
        })
        profileUpdater(res);
      }
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !openModal) {
        setIsOpen(false);
      }
    }
    // console.log("clicked");
    document.addEventListener('mousedown', handleClickOutside);
    // cleanup fn
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModal, dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {userInfo?.name.slice(0, 7)}..
          {
            userInfo?.profileImg ?
              (<img src={userInfo.profileImg} alt="profile" className="w-6 h-6 rounded-full object-fill" />)
              : (<Avatar className={"w-6 h-6"} />)
          }
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <ul>
              <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={viewProfile}>
                View Profile
              </li>
              <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={HandleLogout}>
                Logout
              </li>
              <Modal
                open={openModal}
                onClose={() => (
                  setOpenModal(false),
                  // reset the values in frontend modal
                  setEditProfile(false),
                  setName(userInfo?.name),
                  setEmail(userInfo?.email),
                  setPassword(null),
                  setNewPassword(null),
                  setUpdateProfileImg(null)
                )}
                classNames={{
                  overlay: 'customOverlay',
                  modal: 'customModal',
                }}
                center >
                <div className="m-3 py-1 flex gap-3" onClick={e => e.stopPropagation()}>
                  <div>
                    {
                      userInfo?.profileImg ?
                        (<div>
                          <img src={userInfo.profileImg} alt="profile" className="w-20 h-20 rounded-full relative" />
                          {editProfile && <EditBtn changeImg={changeImg} className={"bottom-28 cursor-pointer bg-white rounded left-20"} />}
                        </div>)
                        : (<div>
                          <Avatar className={"w-20 h-20"} textClass={"text-3xl font-semibold"} />
                          {editProfile && <EditBtn changeImg={changeImg} className={"bottom-28 cursor-pointer bg-white rounded left-20"} />}
                        </div>
                        )
                    }
                  </div>
                  <div>
                    <p
                      className="text-lg font-semibold">Name:
                      {editProfile ?
                        (
                          <input
                            className="border-2 border-black rounded px-1 ml-1 bg-transparent max-w-32"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) :
                        (
                          <span className="px-1 ml-1">{name}</span>
                        )}
                    </p>
                    <p className="text-lg font-semibold">Email:
                      {editProfile ?
                        (
                          <input
                            className="border-2 border-black rounded px-1 ml-1 bg-transparent max-w-44 mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        ) :
                        (
                          <span className="px-1 ml-1">{email}</span>
                        )}
                    </p>
                    <p className="text-lg font-semibold">
                      {editProfile ? "Old Password: " : "Password:"}
                      {editProfile ?
                        (
                          <input
                            className="border-2 border-black rounded px-1 ml-1 bg-transparent max-w-40 mt-1"
                            placeholder='*********'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        ) :
                        (
                          <span className="px-1 ml-1">*********</span>
                        )
                      }
                    </p>

                    {editProfile ?
                      (
                        <p className="text-lg font-semibold">New Password:
                          <input
                            className="border-2 border-black rounded px-1 ml-1 bg-transparent max-w-40 my-1"
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </p>
                      ) :
                      ""}
                    <button
                      className="bg-indigo-500 text-white py-1 px-3 rounded cursor-pointer"
                      type="button"
                      onClick={handleEditProfile}
                    >{editProfile ? "Save" : "Edit"}</button>
                  </div>
                </div>
              </Modal>
            </ul>
            {
              isEditDone && <Alert type={editType} message={editMessage} />
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
