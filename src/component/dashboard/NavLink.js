import { faAdd, faPen, faUsers } from "@fortawesome/free-solid-svg-icons";


export const NavLinks =[
    {
        name:"users",
        path:"user",
        icon: faUsers,
        role: "1995"

    },
    {
        name:"Add User",
        path:"user/add",
        icon: faAdd,
        role: "1995"

        
    },
    {
        name:"categories",
        path:"categories",
        icon: faUsers,
        role: ["1995","1999","2001"]

        
    },
    {
        name:"products",
        path:"products",
        icon: faPen,
        role: ["1995","1996","2001"]

        
    },
    {
        name:"Add product ",
        path:"products/add",
        icon: faPen,
        role: ["1995","1996"]

        
    }, {
        name:"writer",
        path:"writer",
        icon: faPen,
        role: ["1995","1996"]

        
    }
]