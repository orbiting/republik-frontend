import test from 'tape'
import { encode, decode, match } from './base64u'

const testSeries = (env) => {
  [
    {
      string: 'heidi',
      base64u: 'aGVpZGk'
    },
    {
      string: 'peter?_',
      base64u: 'cGV0ZXI_Xw' // Not urlsafe: cGV0ZXI/Xw
    },
    {
      string: '12345><',
      base64u: 'MTIzNDU-PA' // Not urlsafe: MTIzNDU+PA
    },
    {
      // window.btoa(<string>) -> InvalidCharacterError
      // requires escaping, URI component codec to be safe in browser
      string: 'π',
      base64u: 'z4A'
    }
  ]
    .forEach(({ title, string, base64u }) => {
      test(`(${env}) base64u ${string} <-> ${base64u}`, assert => {
        const encoded = encode(string)
        assert.equal(encoded, base64u)

        const decoded = decode(encoded)
        assert.equal(decoded, string)

        assert.end()
      })
    })

  test(`(${env}) base64u.decode w/ block padding "="`, assert => {
    assert.equal(decode('a2xhcmE='), 'klara')
    assert.end()
  })

  test(`(${env}) base64u.decode w/o block padding "="`, assert => {
    assert.equal(decode('a2xhcmE'), 'klara')
    assert.end()
  })

  test(`(${env}) base64u.match "a2xhcmE=" -> false`, assert => {
    assert.equal(match('a2xhcmE='), false)
    assert.end()
  })

  test(`(${env}) base64u.match "a2xhcmE" -> true`, assert => {
    assert.equal(match('a2xhcmE'), true)
    assert.end()
  })

  test(`(${env}) base64u.match "cGV0ZXI_Xw" -> true`, assert => {
    assert.equal(match('cGV0ZXI_Xw'), true)
    assert.end()
  })

  test(`(${env}) base64u.match "cGV0ZXI/Xw" -> false`, assert => {
    assert.equal(match('cGV0ZXI/Xw'), false)
    assert.end()
  })

  test(`(${env}) base64u.match "cGV0ZXI/Xw" -> false`, assert => {
    assert.equal(match('cGV0ZXI/Xw'), false)
    assert.end()
  })
}

// Test Node.JS path
testSeries('node')

// Test (emulated) Browser window global variable
global.window = require('abab')
testSeries('browser')
