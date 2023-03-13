import { Button, Input } from "@mui/material"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Suspense, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { MainCanvas } from "./three/components/main_canvas"
// const socket = io('http://localhost:3000')

export const MainPage = () => {
    const [room, setRoom] = useState('');

    return <div>
        <div className="flex justify-end p-5 bg-primary-500">
            <ConnectButton />
        </div>
        
        <div className="h-screen">
            <Suspense fallback={null}>
                <MainCanvas />
            </Suspense>
        </div>
        
        {/* <Input
            placeholder="Room Name"
            value={room}
            onChange={(e)=>setRoom(e.target.value)}
        /> */}
        {/* <Button 
            onClick={enterRoom}
        >Create room</Button> */}
    </div>
}