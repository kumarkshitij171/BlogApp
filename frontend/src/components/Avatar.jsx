import React, { useContext, useMemo } from 'react'
import { UserContext } from '../context/UserContext';

const Avatar = ({className,textClass}) => {
    const { userInfo } = useContext(UserContext)
    const username = userInfo?.name;
    
    const color = useMemo(() => {
        const colors = [
            'bg-teal-200', 'bg-red-200',
            'bg-green-200', 'bg-purple-200',
            'bg-blue-200', 'bg-yellow-200',
            'bg-orange-200', 'bg-pink-200',
            'bg-fuchsia-200', 'bg-rose-200'
        ];
        const colorIndex = Math.floor(Math.random() * colors.length);
        return colors[colorIndex];
    }, [username])
    
    return (
        <div>
            <div className={`${className} ml-2 relative rounded-full flex items-center ${color}`}>
                <button 
                type='button'
                className={`text-center w-full opacity-70 ${textClass}`}>{username[0].toUpperCase()}</button>

            </div>
        </div>
    )
}

export default Avatar
