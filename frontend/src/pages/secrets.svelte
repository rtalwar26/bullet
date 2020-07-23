<script>
  import { onMount } from "svelte";
  import {
    f7ready,
    f7,
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    Toggle,
    BlockTitle,
    Row,
    Button,
    Range,
    Block
  } from "framework7-svelte";

  let secret_name = "";
  let secret_value = "";
  let user_pub = "";

  onMount(() => {
    f7ready(() => {
      user_pub = f7.gun.user()._.sea.pub;
      console.log("pair", f7.gun.user()._.sea);
    });
  });

  function showSecrets() {}
  function saveSecret() {
    let secret_obj = {};

    f7.gun
      .user()
      .get("secrets")
      .get(secret_name)
      .put(secret_value, ack => {
        f7.dialog.alert(`secret saved successfully`);
      });
  }
</script>

<Page name="secrets">
  <Navbar title="Secrets" backLink="Back" />

  <BlockTitle>Manage Secrets</BlockTitle>

  <List noHairlinesMd>
    <ListInput
      value={user_pub}
      readonly="true"
      label="Pub key"
      type="text"
      placeholder="pubkey" />

    <ListInput
      onInput={e => (secret_name = e.target.value)}
      value={secret_name}
      label="Name"
      type="text"
      placeholder="name of the secret" />

    <ListInput
      onInput={e => (secret_value = e.target.value)}
      value={secret_value}
      label="Value"
      type="text"
      placeholder="value of the secret" />

    <Button onClick={() => saveSecret()} large fill raised color="green">
      Save
    </Button>

    <Button onClick={() => showSecrets()} large raised color="blue">
      Show All
    </Button>
  </List>
</Page>
