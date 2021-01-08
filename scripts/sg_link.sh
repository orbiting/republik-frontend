rm -rf .next
yarn link @project-r/styleguide
rm -rf node_modules/glamor
rm -rf node_modules/react
rm -rf node_modules/react-dom
ln -s @project-r/styleguide/node_modules/glamor node_modules/glamor
ln -s @project-r/styleguide/node_modules/react node_modules/react
ln -s @project-r/styleguide/node_modules/react-dom node_modules/react-dom

sed -i.bak 's/sg_link\.sh",/sg_link\.sh" , "preinstall": "yarn sg:unlink",/g' ./package.json
rm package.json.bak

echo '\n⚠️  Make sure to restart the next.js server. To unlink run yarn.\n'
