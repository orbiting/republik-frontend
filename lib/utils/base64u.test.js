import test from 'tape'
import { encode, decode, match } from './base64u'

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
    string: 'öhi&øπ',
    base64u: 'w7ZoaSbDuM-A' // Not urlsafe: w7ZoaSbDuM+A
  }
]
  .forEach(({ title, string, base64u }) => {
    test(`base64 ${string} <-> ${base64u}`, assert => {
      const encoded = encode(string)
      assert.equal(encoded, base64u)

      const decoded = decode(encoded)
      assert.equal(decoded, string)

      assert.end()
    })
  })

test(`base64u.decode w/ block padding "="`, assert => {
  assert.equal(decode('a2xhcmE='), 'klara')
  assert.end()
})

test(`base64u.decode w/o block padding "="`, assert => {
  assert.equal(decode('a2xhcmE'), 'klara')
  assert.end()
})

test(`base64u.match "a2xhcmE=" -> false`, assert => {
  assert.equal(match('a2xhcmE='), false)
  assert.end()
})

test(`base64u.match "a2xhcmE" -> true`, assert => {
  assert.equal(match('a2xhcmE'), true)
  assert.end()
})

test(`base64u.match "cGV0ZXI_Xw" -> true`, assert => {
  assert.equal(match('cGV0ZXI_Xw'), true)
  assert.end()
})

test(`base64u.match "cGV0ZXI/Xw" -> false`, assert => {
  assert.equal(match('cGV0ZXI/Xw'), false)
  assert.end()
})
