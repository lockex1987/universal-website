<template>
  <div class="mb-3">
    <h4>
      Type
    </h4>
    <p>
      There are primary button, default button, dashed button, text button and link button in antd.
    </p>

    <a-space class="mb-3">
      <a-button type="primary">Primary Button</a-button>
      <a-button>Default Button</a-button>
      <a-button type="dashed">Dashed Button</a-button>
      <a-button type="text">Text Button</a-button>
      <a-button type="link">Link Button</a-button>

      <a-button
        type="primary"
        danger
      >Danger</a-button>
      <a-button
        type="primary"
        ghost
      >Ghost</a-button>
      <a-button
        type="primary"
        disabled
      >Disabled</a-button>
      <a-button
        type="primary"
        loading
      >Loading</a-button>
    </a-space>

    <div class="mb-3">
      <a-button type="primary">No block</a-button>

      <a-button
        type="primary"
        block
      >Block</a-button>
    </div>

    <div class="mb-3">
      <a-space>
        <a-button
          type="primary"
          shape="circle"
        >Circle</a-button>

        <a-button
          type="primary"
          shape="rounded"
        >Rounded</a-button>
      </a-space>
    </div>

    <div class="mb-3">
      <a-space>
        <a-button type="primary">Type button (default)</a-button>

        <a-button
          type="primary"
          htmlType="submit"
        >Type submit</a-button>
      </a-space>
    </div>
  </div>
</template>
