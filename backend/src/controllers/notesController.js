import Note from '../models/note.js'

export async function getNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // muestra el más reciente primero
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes', error: error.message });
  }
}

export async function getNoteById(req, res) {
  const { id } = req.params;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note', error: error.message });
  }
}

export async function createNote(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newNote = await Note.create({ title, content });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
}

export async function updateNote(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  if (title === undefined && content === undefined) {
    return res.status(400).json({ message: 'At least one field (title or content) is required' });
  }

  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
}

export async function deleteNote(req, res) {
  const { id } = req.params;

  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
}
