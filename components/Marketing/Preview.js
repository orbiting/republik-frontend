// import React, { Fragment } from 'react'
// import { graphql, compose } from 'react-apollo'
// import gql from 'graphql-tag'
//
// import createFrontSchema from '@project-r/styleguide/lib/templates/Front'
// import { css } from 'glamor'
// import {
//   Container,
//   fontFamilies,
//   mediaQueries,
//   InlineSpinner
// } from '@project-r/styleguide'
//
// import withMe from '../../lib/apollo/withMe'
// import Link from '../Link/Href'
//
// import SignIn from '../Auth/SignIn'
// import StatusError from '../StatusError'
// import SignUp from './SignUp'
// import { renderMdast } from 'mdast-react-render'
//
// import { PUBLIC_BASE_URL } from '../../lib/constants'
//
// const schema = createFrontSchema({
//   Link
// })
//
// const getDocument = gql`
//   query getFront($path: String!, $first: Int!, $after: ID) {
//     front: document(path: $path) {
//       id
//       content
//     }
//   }
// `
//
// const styles = {
//   headline: css({
//     fontSize: '30px',
//     lineHeight: '34px',
//     margin: '0 auto',
//     fontWeight: 'normal',
//     fontFamily: fontFamilies.sansSerifMedium,
//     marginTop: '20px',
//     [mediaQueries.mUp]: {
//       fontSize: '40px',
//       lineHeight: '46px',
//       marginTop: '70px'
//     }
//
//   }),
//   lead: css({
//     fontSize: '16px',
//     lineHeight: '24px',
//     fontFamily: fontFamilies.sansSerifRegular,
//     margin: '12px auto 0 auto',
//     [mediaQueries.mUp]: {
//       fontSize: '22px',
//       lineHeight: '30px',
//       marginTop: '40px'
//     }
//   }),
//   signUp: css({
//     marginTop: '18px',
//     marginBottom: '40px',
//     [mediaQueries.mUp]: {
//       marginTop: '52px',
//       marginBottom: '80px'
//     }
//   })
// }
//
// const Preview = ({ me }) => {
//   return (
//     <Container style={{ maxWidth: '665px' }}>
//       <SignUp />
//     </Container>
//   )
// }
// export default compose(
//   withMe
// )(Preview)
