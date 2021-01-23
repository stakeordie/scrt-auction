<template>
  <div class="loading-icon">
    <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <slot></slot>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.loading-icon {
    width: 100%;
    display: grid;
    justify-items: center;

    p {
      font-weight: 600;
      font-size: 0.9em;
      color: var(--color-turquoise-secondary);
    }
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: var(--f-gutter);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 60px;
  height: 60px;
  margin: 14px 7px;
  border: 7px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
  border: 8px solid var(--color-turquoise-secondary);
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
