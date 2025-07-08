export default{
    'GET /api/getUsers':[
        {id:'001',name:'张三',age:18},
        {id:'002',name:'李四',age:19},
        {id:'003',name:'王五',age:20}
    ],

    'GET /api/getUser/001':{id:'001',name:'张三',age:18},

    'POST /api/users':{res:true}
}