import { Room } from "@/views/mainPage"
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";

interface DrawerCustomProps {
    rooms?: Room[]
}
export const DrawerCustom = ({
    rooms,
}: DrawerCustomProps) => {
    console.log('rooms: ', rooms)

    return <div>
        {rooms ?
            <List>
                {rooms.map((room: Room, index: number) =>
                    <ListItem key={index}>
                        <ListItemText primary={room.roomId} />
                    </ListItem>
                )}
            </List>
            : <></>}
    </div>
}