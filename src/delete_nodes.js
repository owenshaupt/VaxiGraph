export const deleteNodes = (label, circle, line) => {
  return new Promise(resolve => {
    let movingLabels = document.getElementsByClassName(`${label}`);
    let movingCircles = document.getElementsByClassName(`${circle}`);
    let perLineG = document.getElementsByClassName(`${line}`);

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