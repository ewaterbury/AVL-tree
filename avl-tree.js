class Tree {
  //Sets root node and builds tree
  constructor(array) {
    this.root = this.newNode(array.pop(), null);
    if (array.lenght > 0) this.buildTree(array);
  }

  //Returns Node
  newNode(data) {
    class Node {
      constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
      }
    }

    return new Node(data);
  }

  //Initiates tree
  buildTree(array) {
    while (array.length > 0) this.insert(array.pop());
  }

  //Insert logic
  insert(value, node = this.root, parent = null) {
    //Checks for duplicates
    if (value === node.data)
      return console.log(`insert error: ${value} already exists in dataset`);

    //Insertion for larger value
    if (value > node.data) {
      if (node.right === null) node.right = this.newNode(value);
      else this.insert(value, node.right, node);
    }

    //Insertion for smaller value
    else {
      if (node.left === null) node.left = this.newNode(value);
      else this.insert(value, node.left, node);
    }

    //Balances tree
    this.rebalance(node, parent);
  }

  //Removes a node from tree
  deleteItem(value, node = this.root, parent = null) {
    //Locates node
    let head = null;

    if (node.right === null && node.left === null && node.data !== value)
      console.log(`error: ${value} does not exist in dataset`);
    else if (node.data < value) this.deleteItem(value, node.right, node);
    else if (node.data > value) this.deleteItem(value, node.left, node);
    //Node delete logic
    else {
      //Leaf delete
      if (node.right === null && node.left === null) {
        if (node === this.root) this.root = null;
        else if (parent.right === node) parent.right = null;
        else parent.left = null;
      }

      //One branch (left)
      else if (node.right !== null && node.left === null) {
        if (parent === this.root) this.root = node.right;
        if (parent.right === node) parent.right = node.right;
        else parent.left = node.right;
      }

      //One branch (right)
      else if (node.right === null && node.left !== null) {
        if (parent === this.root) this.root = node.left;
        if (parent.right === node) parent.right = node.left;
        else parent.left = node.left;
      }

      //Two branches
      else if (node.right !== null && node.left !== null) {
        //Deleting root
        if (parent === null) {
          head = this.getLeftSuccessor(node.right);
          this.root = head;
        }

        //Deleting right node of parent
        else if (parent.right === node) {
          head = this.getLeftSuccessor(node.right, node);
          parent.right = head;
        }

        //Deleting left node of parent
        else if (parent.left === node) {
          head = this.getLeftSuccessor(node.right, node);
          parent.left = head;
        }

        //Transfer left and right node of deleted node
        head.right = node.right;
        head.left = node.left;
      }
    }

    if (head !== null) this.rebalance(head, parent); //This may be solution
    else this.rebalance(node, parent);
  }

  //Returns leftmost successor to target node
  getLeftSuccessor = (node, parent = null) => {
    let leftMost;
    if (node.left === null && node.right === null) {
      leftMost = node;
      if (parent.right === node) parent.right = null;
      else if (parent.left === node) parent.left = null;
      return leftMost;
    } else if (node.left === null && node.right !== null) {
      leftMost = node;
      if (parent.right === node) parent.right = node.right;
      else if (parent.left === node) parent.left = node.right;
      return leftMost;
    } else return this.getLeftSuccessor(node.left, node);
  };

  //Finds depth from given node
  getDepth(node = this.root) {
    //Exit condition
    if (node === null) return 0;

    //Finds depth of right node
    const rightDepth = this.getDepth(node.right);

    //Finds depth of left node
    const leftDepth = this.getDepth(node.left);

    //Selects and returns larger value
    return Math.max(rightDepth, leftDepth) + 1;
  }

  //Prints tree in console.log
  PrintTree(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;
    if (node.right !== null)
      this.PrintTree(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null)
      this.PrintTree(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }

  //Returns node
  find(value, node = this.root) {
    //Value not found
    if (node === null) {
      return null;
    }

    //Value found
    if (node.data === value) return node;

    //Seach logic
    if (node.data < value) return this.find(value, node.right);
    if (node.data > value) return this.find(value, node.left);
  }

  //Performs callback on each node in levelorder traversal
  levelOrder(callback) {
    let queue = [];
    queue.push(this.root);
    if (typeof callback != "function")
      throw new TypeError("argument must be a function");
    while (queue[0]) {
      if (queue[0].left !== null) queue.push(queue[0].left);
      if (queue[0].right !== null) queue.push(queue[0].right);
      callback(queue.shift());
    }
  }

  //Performs callback on each node in inorder traversal
  inOrder(callback, node = this.root) {
    if (node.left !== null) this.inOrder(callback, node.left);
    callback(node);
    if (node.right !== null) this.inOrder(callback, node.right);
  }

  //Performs callback on each node in preorder traversal
  preOrder(callback, node = this.root) {
    callback(node);
    if (node.left !== null) this.preOrder(callback, node.left);
    if (node.right !== null) this.preOrder(callback, node.right);
  }

  //Performs callback on each node in postorder traversal
  postOrder(callback, node = this.root) {
    if (node.left !== null) this.postOrder(callback, node.left);
    if (node.right !== null) this.postOrder(callback, node.right);
    callback(node);
  }

  //Returns a node's height
  height(node) {
    return this.getDepth(node) - 1;
  }

  //Determines if tree is balanced
  isBalanced() {
    //Calculates balance
    const balance =
      this.getDepth(this.root.right) + this.getDepth(this.root.left) * -1;

    //Determines balance
    if (balance <= 1 && balance >= -1) return true;
    return false;
  }

  //Rebalances tree
  rebalance(node, parent) {
    //NOTE: Variables in method refer to position of nodes after rotation.

    //Calculates Balance of Node
    let balance = this.getDepth(node.right) + this.getDepth(node.left) * -1;

    //Right skewed imbalance
    if (balance > 1) {
      //RR Imbalance
      if (this.getDepth(node.right.right) > this.getDepth(node.right.left)) {
        const head = node.right;
        const right = node.right.right;
        const leftRight = node.right.left;
        const left = node;
        if (parent === null) this.root = head;
        else if (parent.right === node) parent.right = head;
        else if (parent.left === node) parent.left = head;
        head.right = right;
        head.left = left;
        head.left.right = leftRight;
      }

      //RL Imbalance
      else {
        const head = node.right.left;
        const right = node.right;
        const rightLeft = node.right.left.right;
        const left = node;
        const leftRight = node.right.left.left;
        if (parent === null) this.root = head;
        else if (parent.right === node) parent.right = head;
        else if (parent.left === node) parent.left = head;
        head.right = right;
        head.right.left = rightLeft;
        head.left = left;
        head.left.right = leftRight;
      }
    }

    //Left Skewed Imbalance
    if (balance < -1) {
      //LL Imbalance

      if (this.getDepth(node.left.left) > this.getDepth(node.left.right)) {
        const head = node.left;
        const right = node;
        const rightLeft = node.left.right;
        const left = node.left.left;
        if (parent === null) this.root = head;
        else if (parent.right === node) parent.right = head;
        else if (parent.left === node) parent.left = head;
        head.right = right;
        head.right.left = rightLeft;
        head.left = left;
      }

      //LR Imbalance
      else {
        const head = node.left.right;
        const right = node;
        const rightLeft = node.left.right.right;
        const left = node.left;
        const leftRight = node.left.right.left;
        if (parent === null) this.root = head;
        else if (parent.right === node) parent.right = head;
        else if (parent.left === node) parent.left = head;
        head.right = right;
        head.right.left = rightLeft;
        head.left = left;
        head.left.right = leftRight;
      }
    }
  }
}

function plantTree(min = 0, max = 100, nodes = 35) {
  if (max - min < nodes) {
    console.log("Error: nodes requested exceeds nodes available.");
    return false;
  }

  //Generates random number
  const getRandom = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  };

  let tree = new Tree([getRandom(min, max)]);
  for (let i = 1; i < nodes; i++) {
    let num = getRandom(min, max);
    while (tree.find(num) !== null) {
      num = getRandom(min, max);
    }
    tree.insert(num);
  }

  for (let i = 1; i < Math.round(nodes / 2); i++) {
    let num = getRandom(min, max);
    while (tree.find(num) === null) {
      num = getRandom(min, max);
    }
    tree.deleteItem(num);
  }

  for (let i = 1; i < Math.round(nodes / 2); i++) {
    let num = getRandom(min, max);
    while (tree.find(num) !== null) {
      num = getRandom(min, max);
    }
    tree.insert(num);
  }

  tree.PrintTree();
}

plantTree();
