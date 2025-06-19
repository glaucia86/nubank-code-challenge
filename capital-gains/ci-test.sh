#!/bin/bash
set -e
npm run build
npm run test
npm run test:coverage
npm run test tests/integration.test.ts
