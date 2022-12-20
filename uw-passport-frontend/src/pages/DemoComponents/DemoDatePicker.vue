<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Demo</li>
      <li class="breadcrumb-item active">Demo Date Picker</li>
    </ol>
  </Teleport>

  <h4>Basic Usage</h4>
  <p>Basic use case. Users can select or input a date in panel.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-date-picker v-model:value="demo1.value1" />
      <a-date-picker
        v-model:value="demo1.value2"
        picker="week"
      />
      <a-date-picker
        v-model:value="demo1.value3"
        picker="month"
      />
      <a-date-picker
        v-model:value="demo1.value4"
        picker="quarter"
      />
      <a-date-picker
        v-model:value="demo1.value5"
        picker="year"
      />
    </a-space>
  </div>

  <h4>Range Picker</h4>
  <p>Set range picker type by picker prop.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-range-picker v-model:value="demo2.value1" />
      <a-range-picker
        v-model:value="demo2.value2"
        show-time
      />
      <a-range-picker
        v-model:value="demo2.value3"
        picker="week"
      />
      <a-range-picker
        v-model:value="demo2.value4"
        picker="month"
      />
      <a-range-picker
        v-model:value="demo2.value5"
        picker="year"
      />
    </a-space>
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>
</template>


<script setup>
// Demo 1
const demo1 = reactive({
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  value5: '',
})


// Demo 2
const demo2 = reactive({
  value1: null,
  value2: null,
  value3: null,
  value4: null,
  value5: null,
})
</script>
