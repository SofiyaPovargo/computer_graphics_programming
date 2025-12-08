import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


class Object3D:
    def __init__(self, vertices, edges):
        self.vertices = np.array(vertices)
        self.edges = edges

    def transform(self, matrix):
        homogenous_vertices = np.hstack((self.vertices, np.ones((self.vertices.shape[0], 1))))
        transformed_vertices = np.dot(homogenous_vertices, matrix.T)
        self.vertices = transformed_vertices[:, :3]
        return matrix

    def plot(self, ax, color='blue', show_vertices=True):
        for edge in self.edges:
            x = [self.vertices[edge[0]][0], self.vertices[edge[1]][0]]
            y = [self.vertices[edge[0]][1], self.vertices[edge[1]][1]]
            z = [self.vertices[edge[0]][2], self.vertices[edge[1]][2]]
            ax.plot(x, y, z, color=color)
        if show_vertices:
            ax.scatter(self.vertices[:, 0], self.vertices[:, 1], self.vertices[:, 2], color='red', s=20)


vertices = [
    [0, 0, 0], [0.2, 0, 0], [0.2, 0, 0.2], [0, 0, 0.2],
    [0, 1, 0], [0.2, 1, 0], [0.2, 1, 0.2], [0, 1, 0.2],
    [0.8, 0, 0], [1.0, 0, 0], [1.0, 0, 0.2], [0.8, 0, 0.2],
    [0.8, 1, 0], [1.0, 1, 0], [1.0, 1, 0.2], [0.8, 1, 0.2],
    [0, 1, 0], [1.0, 1, 0], [1.0, 1, 0.2], [0, 1, 0.2],
    [0, 1.2, 0], [1.0, 1.2, 0], [1.0, 1.2, 0.2], [0, 1.2, 0.2],
]

edges = [
    [0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
    [8, 12], [9, 13], [10, 14], [11, 15], [8, 9], [9, 10], [10, 11], [11, 8], [12, 13], [13, 14], [14, 15], [15, 12],
    [16, 20], [17, 21], [18, 22], [19, 23], [16, 17], [17, 18], [18, 19], [19, 16], [20, 21], [21, 22], [22, 23], [23, 20],
    [4, 16], [5, 17], [12, 17], [13, 21]
]


def scale_matrix(sx, sy, sz):
    return np.array([[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]])

def translate_matrix(tx, ty, tz):
    return np.array([[1, 0, 0, tx], [0, 1, 0, ty], [0, 0, 1, tz], [0, 0, 0, 1]])

def rotate_matrix_z(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s, 0, 0], [s, c, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])


fig = plt.figure(figsize=(20, 12))

ax1 = fig.add_subplot(2, 3, 1, projection='3d')
letter_p = Object3D(vertices, edges)
letter_p.plot(ax1)
ax1.set_title("1. Исходная 3D модель буквы 'П'")
ax1.set_xlabel("X")
ax1.set_ylabel("Y")
ax1.set_zlabel("Z")

ax2 = fig.add_subplot(2, 3, 2)
for edge in letter_p.edges:
    x = [letter_p.vertices[edge[0]][0], letter_p.vertices[edge[1]][0]]
    y = [letter_p.vertices[edge[0]][1], letter_p.vertices[edge[1]][1]]
    ax2.plot(x, y, color='blue')
ax2.scatter(letter_p.vertices[:, 0], letter_p.vertices[:, 1], color='red', s=20)
ax2.set_title("2. Проекция Oxy (вид сверху)")
ax2.set_xlabel("X")
ax2.set_ylabel("Y")
ax2.grid()
ax2.set_aspect('equal')

ax3 = fig.add_subplot(2, 3, 3)
for edge in letter_p.edges:
    x = [letter_p.vertices[edge[0]][0], letter_p.vertices[edge[1]][0]]
    z = [letter_p.vertices[edge[0]][2], letter_p.vertices[edge[1]][2]]
    ax3.plot(x, z, color='green')
ax3.scatter(letter_p.vertices[:, 0], letter_p.vertices[:, 2], color='red', s=20)
ax3.set_title("3. Проекция Oxz (вид спереди)")
ax3.set_xlabel("X")
ax3.set_ylabel("Z")
ax3.grid()
ax3.set_aspect('equal')

scale = letter_p.transform(scale_matrix(1.5, 1.5, 1.5))
translate = letter_p.transform(translate_matrix(0.5, 0.5, 0.5))
rotate = letter_p.transform(rotate_matrix_z(np.pi / 6))

ax4 = fig.add_subplot(2, 3, 4, projection='3d')
letter_p.plot(ax4)
ax4.set_title("4. После преобразований\n(Масштаб 1.5, Сдвиг (0.5,0.5,0.5),\nПоворот 30°)")
ax4.set_xlabel("X")
ax4.set_ylabel("Y")
ax4.set_zlabel("Z")

ax5 = fig.add_subplot(2, 3, 5)
for edge in letter_p.edges:
    x = [letter_p.vertices[edge[0]][0], letter_p.vertices[edge[1]][0]]
    y = [letter_p.vertices[edge[0]][1], letter_p.vertices[edge[1]][1]]
    ax5.plot(x, y, color='blue')
ax5.scatter(letter_p.vertices[:, 0], letter_p.vertices[:, 1], color='red', s=20)
ax5.set_title("5. Проекция Oxy после преобразований")
ax5.set_xlabel("X")
ax5.set_ylabel("Y")
ax5.grid()
ax5.set_aspect('equal')

ax6 = fig.add_subplot(2, 3, 6)
for edge in letter_p.edges:
    x = [letter_p.vertices[edge[0]][0], letter_p.vertices[edge[1]][0]]
    z = [letter_p.vertices[edge[0]][2], letter_p.vertices[edge[1]][2]]
    ax6.plot(x, z, color='green')
ax6.scatter(letter_p.vertices[:, 0], letter_p.vertices[:, 2], color='red', s=20)
ax6.set_title("6. Проекция Oxz после преобразований")
ax6.set_xlabel("X")
ax6.set_ylabel("Z")
ax6.grid()
ax6.set_aspect('equal')

plt.tight_layout()
plt.show()

print("=" * 60)
print("ИТОГОВАЯ МАТРИЦА ПРЕОБРАЗОВАНИЙ:")
print("=" * 60)
print(rotate)
print("\nПримененные преобразования:")
print("1. Масштабирование: 1.5 по всем осям")
print("2. Перенос: (0.5, 0.5, 0.5)")
print("3. Поворот: 30° вокруг оси Z")