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

  <h4>Switchable picker</h4>
  <p>Switch in different types of pickers by Select.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-select v-model:value="type">
        <a-select-option value="time">Time</a-select-option>
        <a-select-option value="date">Date</a-select-option>
        <a-select-option value="week">Week</a-select-option>
        <a-select-option value="month">Month</a-select-option>
        <a-select-option value="quarter">Quarter</a-select-option>
        <a-select-option value="year">Year</a-select-option>
      </a-select>

      <template v-if="type === 'time'">
        <a-time-picker />
      </template>
      <template v-else>
        <a-date-picker :picker="type" />
      </template>
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


// Demo 3
const type = ref('time')
</script>
