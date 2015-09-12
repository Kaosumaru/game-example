#!/usr/bin/env node

'use strict'
let index = require('./src/game_object')
let Server = require('cb-http-ws-server')
let hyperion = require('cb-hyperion').hyperion


hyperion({
  wss : Server({
    dirname : '/client'
  }),
  index : index
})