<template>
<landing-layout>
<columns class="intro" mode="normal" mode-m="full" number="2" number-m="1" number-s="1">
  <block>
    <h1 class="mega">The Sealed Bid OTC Marketplace</h1>
    <p>Exchange assets peer-to-peer privately and with minimal fees. The only decentralized, sealed bid auction platform. Made possible by runnin on Secret Network</p>
    <button @click="$router.push('/auctions')" class="white">Use Secret Auctions</button>
  </block>
  <block>
    <img src="@/assets/illustration-landing.svg" alt="">
  </block>
</columns>
</landing-layout>
</template>

<script>

export default {
  metaInfo: {
    title: 'Secret Auctions',
  }
}
</script>

<style lang="scss">

@import "@lkmx/flare/src/functions/respond-to";

.intro {
  align-items: center;
  @include respond-to("<=m") {
      align-items: center;
  }
  @include respond-to("<=s") {
      padding-top: var(--f-gutter);
      align-items: start;
    }
  .--flare-block {
    .content {
      @include respond-to(">=xxxl") {
        width: 1000px;
      }
    }
  }
  h1 {
    &.mega {
      font-size: 56px;
      @include respond-to(">=xxxl") {
        font-size: var(--f-gutter-xxxl);
        margin-bottom: var(--f-gutter-xl);
      }
    }
  }
  p {
    @include respond-to(">=xxxl") {
      font-size: var(--f-gutter-xl);
      margin-bottom: var(--f-gutter-xl);
     }
  }
  button {
    @include respond-to(">=xxxl") {
      padding: var(--f-gutter-xl);
      font-size: var(--f-gutter-xl);
     }
  }
  button {
    &.white {
      background-color:white;
      color:black;
      cursor: pointer;
      &:hover {
        background-color:lightgray;
      }
    }
  }
  img {
    @include respond-to(">=xxxl") {
      height: 600px;
      width: auto;
    }
    @include respond-to("<=m") {
      display: none;
    }
  }
}
</style>
