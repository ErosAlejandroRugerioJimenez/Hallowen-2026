import test from 'node:test'
import assert from 'node:assert/strict'
import { getRemainingTime } from '../src/lib/countdown.ts'

import { event } from '../src/data/event.ts'
const target = event.startsAt
test('la fecha corresponde a las 5:30 pm de México, no a la zona del visitante', () => {
  assert.equal(Date.parse(target), Date.parse('2026-11-02T23:30:00Z'))
})
test('separa días, horas, minutos y segundos', () => {
  const difference = (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000
  assert.deepEqual(getRemainingTime(target, Date.parse(target) - difference), {
    days: 2, hours: 3, minutes: 4, seconds: 5, started: false,
  })
})
test('no anuncia el inicio antes de la hora exacta', () => {
  assert.equal(getRemainingTime(target, Date.parse(target) - 1).seconds, 1)
  assert.equal(getRemainingTime(target, Date.parse(target) - 1).started, false)
})
test('al iniciar o después, no muestra valores negativos', () => {
  for (const offset of [0, 60000, 86400000]) {
    assert.deepEqual(getRemainingTime(target, Date.parse(target) + offset), {
      days: 0, hours: 0, minutes: 0, seconds: 0, started: true,
    })
  }
})
test('rechaza fechas inválidas', () => assert.throws(() => getRemainingTime('invalid'), /fecha/))

