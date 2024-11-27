참고 
   https://medium.com/econialabs/aptos-multisig-v2-and-econia-v4-757d542238cc
   

"ace.key" already exists, are you sure you want to overwrite it? [yes/no] >
yes
"ace.key.pub" already exists, are you sure you want to overwrite it? [yes/no] >
yes
{
  "Result": {
    "Account Address:": "0xacea17595362958d62411d76ecb8c0bd6a5ce4e238a51e11321ac8ecd997b1ac",
    "PrivateKey Path": "ace.key",
    "PublicKey Path": "ace.key.pub"
  }
}
"bee.key" already exists, are you sure you want to overwrite it? [yes/no] >
yes
"bee.key.pub" already exists, are you sure you want to overwrite it? [yes/no] >
yes
{
  "Result": {
    "PrivateKey Path": "bee.key",
    "PublicKey Path": "bee.key.pub",
    "Account Address:": "0xbee53d71fe7ca172cf7cbbf82ab4fbaf0be2fe43fe237170491108e20798b14f"
  }
}
"cad.key" already exists, are you sure you want to overwrite it? [yes/no] >
yes
"cad.key.pub" already exists, are you sure you want to overwrite it? [yes/no] >
yes
{
  "Result": {
    "Account Address:": "0xcadb91da7743effaad224f5ec562296d12b860f22901293f4c03715035d6c452",
    "PrivateKey Path": "cad.key",
    "PublicKey Path": "cad.key.pub"
  }
}
╭─    ~/Desktop/aptos-study/multisig    main ?1                                        ✔  13s   14:32:32  ─╮
╰─ aptos key generate --vanity-prefix 0xc0de --output-file creator.key --vanity-multisig                              ─╯
{
  "Result": {
    "PrivateKey Path": "creator.key",
    "Multisig Account Address:": "0xc0de5f8229ea211bf51bf9a8ebd353a8613ff01e071b7cae0c2b1842b2c273ca",
    "Account Address:": "0xd91343bfdc8b37595ae431f668a9cbb500ca2fb60e231a055f17624cbe763386",
    "PublicKey Path": "creator.key.pub"
  }
}

```bash
aptos key generate \
 --vanity-prefix 0xace \
 --output-file ace.key

aptos key generate \
 --vanity-prefix 0xbee \
 --output-file bee.key

aptos key generate \
 --vanity-prefix 0xcad \
 --output-file cad.key
```

```bash
aptos key generate \
 --vanity-prefix 0xc0de \
 --output-file creator.key \
 --vanity-multisig
```

```bash
export ace_addr=0xacea17595362958d62411d76ecb8c0bd6a5ce4e238a51e11321ac8ecd997b1ac
export bee_addr=0xbee53d71fe7ca172cf7cbbf82ab4fbaf0be2fe43fe237170491108e20798b14f
export cad_addr=0xcadb91da7743effaad224f5ec562296d12b860f22901293f4c03715035d6c452
export creator_addr=0xc0de5f8229ea211bf51bf9a8ebd353a8613ff01e071b7cae0c2b1842b2c273ca
export c0de_addr=0xd91343bfdc8b37595ae431f668a9cbb500ca2fb60e231a055f17624cbe763386
```

```bash
aptos account fund-with-faucet --account $ace_addr
aptos account fund-with-faucet --account $bee_addr
aptos account fund-with-faucet --account $cad_addr
aptos account fund-with-faucet --account $creator_addr
```

```bash
aptos multisig create \
 --additional-owners \
  $ace_addr \
  $bee_addr \
  $cad_addr \
 --num-signatures-required 2 \
 --private-key-file creator.key
```