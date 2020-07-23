<script>
  import { onMount } from "svelte";

  import {
    f7,
    f7ready,
    App,
    Panel,
    Views,
    View,
    Popup,
    Page,
    Navbar,
    Toolbar,
    NavRight,
    Link,
    Block,
    BlockTitle,
    LoginScreen,
    LoginScreenTitle,
    List,
    ListItem,
    ListInput,
    ListButton,
    BlockFooter
  } from "framework7-svelte";

  import routes from "../js/routes";

  // Framework7 Parameters
  let f7params = {
    name: "ubllet", // App name
    theme: "auto", // Automatic theme detection

    // App routes
    routes: routes,
    gun: {
      peers: ["http://localhost:8765/gun"],
      localStorage: true
    }
  };
  // Login screen demo data
  let private_key = "KWvVBIlXYEBPV022lleL5Q4fLs5oaGIjQQLuNJkfFBY";
  let public_key =
    "DOjyPCZ8WGgZFPcMRlGLcj2L3Ek7gP8fyXsCPcCvsOY.qLt10-1XOtU9qvnypQkUtLgJb3BzC5vYPpAa6ApppXs";

  function logout() {
    f7.gun.user().leave({}, ack => {
      console.log({ ack });
    });
  }
  function openSignupScreen() {
    f7.loginScreen.close("#my-login-screen");
    f7.loginScreen.open("#my-signup-screen");
  }
  function alertSignupData() {
    let username =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    let password =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);

    f7.gun.user().create(username, password, ack => {
      (ack.err
        ? () => {
            f7.dialog.alert(`Unable to signup,please report the support team`);
          }
        : () => {
            let credentials = f7.gun.user()._.sea;
            f7.dialog.alert(
              `private : ${credentials.epriv}\n` +
                `public : ${credentials.epub}`,
              `Please store these in a safe place\n`,
              () => {
                f7.loginScreen.close("#my-signup-screen");
                f7.loginScreen.open("#my-login-screen");
              }
            );
          })();
    });
  }
  function alertLoginData() {
    f7.gun.on("auth", user => {
      (user.err
        ? () => {
            f7.dialog.alert(`${user.err}`);
          }
        : () => {
            f7.loginScreen.close("#my-login-screen");
          })();
    });

    f7.gun.user().auth({ epriv: private_key, epub: public_key });
  }
  onMount(() => {
    f7ready(() => {
      // Call F7 APIs here
    });
  });
</script>

<App params={f7params}>

  <!-- Left panel with cover effect when hidden -->
  <Panel left cover themeDark visibleBreakpoint={960}>
    <View>
      <Page>
        <Navbar title="Left Panel" />
        <BlockTitle>Left View Navigation</BlockTitle>
        <List>
          <ListItem link="/left-page-1/" title="Left Page 1" />
          <ListItem link="/left-page-2/" title="Left Page 2" />
        </List>
        <BlockTitle>Control Main View</BlockTitle>
        <List>
          <ListItem link="/about/" view=".view-main" panelClose title="About" />
          <ListItem link="/form/" view=".view-main" panelClose title="Form" />
          <ListItem
            link="#"
            view=".view-main"
            back
            panelClose
            title="Back in history" />
        </List>
      </Page>
    </View>
  </Panel>

  <!-- Right panel with reveal effect-->
  <Panel right reveal themeDark>
    <View>
      <Page>
        <Navbar title="Right Panel" />
        <Block>Right panel content goes here</Block>
      </Page>
    </View>
  </Panel>

  <!-- Your main view, should have "view-main" class -->
  <View main class="safe-areas" url="/" />

  <!-- Popup -->
  <Popup id="my-popup">
    <View>
      <Page>
        <Navbar title="Popup">
          <NavRight>
            <Link popupClose>Close</Link>
          </NavRight>
        </Navbar>
        <Block>
          <p>Popup content goes here.</p>
        </Block>
      </Page>
    </View>
  </Popup>

  <LoginScreen id="my-login-screen">
    <View>
      <Page loginScreen>
        <LoginScreenTitle>Login</LoginScreenTitle>
        <List form>
          <ListInput
            type="text"
            name="private_key"
            placeholder="private_key"
            value={private_key}
            onInput={e => (private_key = e.target.value)} />
          <ListInput
            type="text"
            name="public_key"
            placeholder="public_key"
            value={public_key}
            onInput={e => (public_key = e.target.value)} />
        </List>
        <List>
          <ListButton title="Sign In" onClick={() => alertLoginData()} />
          <ListButton title="Sign Up" onClick={() => openSignupScreen()} />
          <ListButton title="Logout" onClick={() => logout()} />
        </List>
        <BlockFooter>
          Some text about login information.
          <br />
          Click "Sign In" to close Login Screen
        </BlockFooter>
      </Page>
    </View>
  </LoginScreen>

  <LoginScreen id="my-signup-screen">
    <View>
      <Page loginScreen>
        <LoginScreenTitle>Signup</LoginScreenTitle>
        <List form>
          <!-- <ListInput
            type="text"
            name="username"
            placeholder="Your username"
            value={username}
            onInput={e => (username = e.target.value)} />
          <ListInput 
          type="password" name="password" placeholder="Your password" value={password}
          onInput={e => (password = e.target.value)} />-->
        </List>
        <List>
          <ListButton title="Sign Up" onClick={() => alertSignupData()} />
        </List>
        <BlockFooter>
          Some text about Signup information.
          <br />
          Click "Sign Up" to close Login Screen
        </BlockFooter>
      </Page>
    </View>
  </LoginScreen>
</App>
