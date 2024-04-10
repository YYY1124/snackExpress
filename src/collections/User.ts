import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig={
    slug: "users",
    auth:{
        verify:{
            generateEmailHTML:({token})=>{
                return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a>`
            },
        },
    },
    access:{
        read:()=>true,
        create:({req})=>req.user.role ==='admin',
    },
    admin:{
        hidden:({user})=>user.role!=='admin'
        // if the user is not admin then hide it
    },
    fields:[
        {
            name:'role',
            required:true,
            defaultValue:'user',
            access:{
                read: ()=>true,
                update: ({req})=>req.user.role ==='admin',
            },
            type:'select',
            options:[
                {label:'Admin', value:'admin'},
                {label:'User',value:'user'},
            ]
        }
    ]
}