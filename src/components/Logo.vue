<template>
  <div class="logo">
    <div class="logo-icon">ゐ</div>
    <div class="logo-text">DongDong</div>
  </div>
</template>

<style lang="scss">
.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  &-icon {
    $icon-size: 44px;
    width: $icon-size;
    height: $icon-size;
    border-radius: 50%;
    background-color: #409eff;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #fff;

    margin-right: 12px;
    user-select: none;
  }
  &-text {
    font-size: 28px;
    margin-bottom: 4px;
    user-select: none;
  }
}
</style>
