var Tartarus = artifacts.require('./Tartarus.sol');
var UserFactory = artifacts.require('./UserFactory.sol');
var CommentFactory = artifacts.require('./CommentFactory.sol');
var PostFactory = artifacts.require('./PostFactory.sol');
var ForumFactory = artifacts.require('./ForumFactory.sol');

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(UserFactory);
    // let userFactory = UserFactory.deployed();

    await deployer.deploy(CommentFactory);
    // let commentFactory = CommentFactory.deployed();

    await deployer.deploy(PostFactory);
    // let postFactory = PostFactory.deployed();

    await deployer.deploy(ForumFactory);
    // let forumFactory = ForumFactory.deployed();

    await deployer.deploy(
      Tartarus,
      UserFactory.address,
      CommentFactory.address,
      PostFactory.address,
      ForumFactory.address
    );
  });
};
