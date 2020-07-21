import Gun from 'gun/gun'
import SEA from 'gun/sea'

let F7Gun = {
    name: 'gun',
    // extend app params with debugger params
    params: {
        gun: {
            localStorage: false,
            peers: []

        }
    },
    create: function () {
        var app = this;
        // extend app methods with debugger methods when app instance just created
        app.gun = {

        }
    },
    on: {
        init: function () {
            var app = this;


            let peers = (app.params.gun && app.params.gun.peers) || []
            let localStorage = (app.params.gun && app.params.gun.localStorage) || false;
            let gun = Gun({ localStorage: true });
            // gun.get('posts').put({ title: "post1" });

            app.gun = gun;
            // console.log(app.gun);
            // console.log(typeof app.gun.user());


        },
        pageBeforeIn: function (page) {
            // if (shopifyEnabled) console.log('pageBeforeIn', page);
        },
        pageAfterIn: function (page) {
            // if (shopifyEnabled) console.log('pageAfterIn', page);
        },
        pageBeforeOut: function (page) {
            // if (shopifyEnabled) console.log('pageBeforeOut', page);
        },
        pageAfterOut: function (page) {
            // if (shopifyEnabled) console.log('pageAfterOut', page);
        },
        pageInit: function (page) {
            // if (shopifyEnabled) console.log('pageInit', page);
        },
        pageBeforeRemove: function (page) {
            // if (shopifyEnabled) console.log('pageBeforeRemove', page);
        },
    }
}
export default F7Gun;