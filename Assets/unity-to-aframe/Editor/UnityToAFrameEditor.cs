using UnityEngine;
using System.Collections;
using UnityEditor;

[CustomEditor(typeof(UnityToAFrame))]
public class UnityToAFrameEditor : Editor {

    public override void OnInspectorGUI()
    {
        UnityToAFrame myExporter = (UnityToAFrame)target;
        if (GUILayout.Button("Export"))
        {
            myExporter.Export();
        }

        DrawDefaultInspector();

        if (GUILayout.Button("Clear Exported Files"))
        {
            myExporter.ClearExport();
        }
    }
}
