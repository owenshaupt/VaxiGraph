export const deleteNodes = () => {
  return new Promise(resolve => {
    let movingLabels = document.getElementsByClassName('moving-label');
    let movingCircles = document.getElementsByClassName('moving-circle');
    let perLineG = document.getElementsByClassName('mouse-per-line');

    for (let i = 1; i < movingLabels.length; i++) {
      const node = movingLabels[i];
      node.remove();
    }

    for (let i = 1; i < movingCircles.length; i++) {
      const node = movingCircles[i];
      node.remove();
    }

    for (let i = 1; i < perLineG.length; i++) {
      const node = perLineG[i];
      node.remove();
    }

    resolve();
  })
}