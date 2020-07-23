import Gun from 'gun/gun'
import SEA from 'gun/sea'

let F7Gun = {
    name: 'gun',
    // extend app params with debugger params
    params: {
        gun: {
            localStorage: false,
            peers: {}

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

            // extend SEA functions to base64 encode encrypted data
            // workaround for https://github.com/amark/gun/issues/783
            (() => {
                const _encrypt = SEA.encrypt;
                SEA.encrypt = function (...args) {
                    return _encrypt.apply(this, args).then(enc => btoa(JSON.stringify(enc)));
                }

                const _decrypt = SEA.decrypt;
                SEA.decrypt = function (data, ...args) {
                    try { data = JSON.parse(atob(data)); }
                    finally { return _decrypt.apply(this, [data, ...args]); }
                }
            })();


            // override User functions to fix several issues
            // see https://github.com/amark/gun/issues/808

            SEA.Gun.User.prototype.grant = function grant(to, cb) {
                const gun = this; const user = gun.back(-1).user();
                const pair = user._.sea; let path = '';

                gun.back(at => { if (at.has) { path += at.get; } });

                (async () => {
                    let enc, sec;

                    if (sec = await user.get('trust').get(pair.pub).get(path).then()) {
                        sec = await SEA.decrypt(sec, pair);

                    } else {
                        sec = SEA.random(24).toString();
                        enc = await SEA.encrypt(sec, pair);

                        user.get('trust').get(pair.pub).get(path).put(enc);
                    }

                    let pub = to.get('pub').then();
                    let epub = to.get('epub').then();

                    pub = await pub; epub = await epub;

                    const dh = await SEA.secret(epub, pair);
                    enc = await SEA.encrypt(sec, dh);

                    // if pub is not already in trust, first put an empty node
                    // workaround for https://github.com/amark/gun/issues/844

                    if (!await user.get('trust').get(pub).then()) {
                        await user.get('trust').get(pub).get(path).put({}).then();
                    }

                    user.get('trust').get(pub).get(path).put(enc, cb);
                })();

                return gun;
            }

            SEA.Gun.User.prototype.secret = function (data, cb) {
                const gun = this; const user = gun.back(-1).user();
                const pair = user._.sea; let path = '';

                gun.back(at => { if (at.has) { path += at.get; } });

                (async () => {
                    let enc, sec;

                    if (sec = await user.get('trust').get(pair.pub).get(path).then()) {
                        sec = await SEA.decrypt(sec, pair);

                    } else {
                        sec = SEA.random(24).toString();
                        enc = await SEA.encrypt(sec, pair);

                        user.get('trust').get(pair.pub).get(path).put(enc);
                    }

                    enc = await SEA.encrypt(data, sec);
                    gun.put(enc, cb);
                })();

                return gun;
            }

            var app = this;


            let peers = (app.params.gun && app.params.gun.peers) || []
            let localStorage = (app.params.gun && app.params.gun.localStorage) || false;
            let gun = Gun({ peers, localStorage: true });
            // let gun = Gun({ peers: ["http://localhost:8765/gun"] });
            // gun.get('posts').put({ title: "post1" });
            gun.user().recall({ sessionStorage: true });

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