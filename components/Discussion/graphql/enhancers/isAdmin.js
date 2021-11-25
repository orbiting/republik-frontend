import withAuthorization from '../../../Auth/withAuthorization'

/**
 * Provides the component with
 *
 *   {
 *     isAdmin: boolean
 *   }
 */

export const isAdmin = withAuthorization(['admin', 'moderator'], 'isAdmin')
