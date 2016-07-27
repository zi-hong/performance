var router = new VueRouter();
router.map({
    '/':{
        component: performance,
        performance:true
    },
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
    },
    '/point':{
        component: point,
        point:true
    },
    '/baseInfoPv':{
        component: baseInfoPv,
        baseInfoPv:true
    },
    '/browser':{
        component: browser,
        browser:true
    },
    '/platform':{
        component:platform,
        platform:true
    },
    '/constant':{
        component:constant,
        constant:true
    }
})