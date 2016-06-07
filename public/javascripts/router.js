var router = new VueRouter();
router.map({
    '/performance': {
        component: performance,
        performance:true
    },
    '/pageSize': {
        component: pageSize,
        pagesize:true
    },
    '/pv':{
    	component: pv,
        pv:true
    }
})